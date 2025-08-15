const GeneralLedgerRepository = require('../repositories/generalLedger.repository');
const PaymentRepository = require('../repositories/payment.repository');
const FundAllocationRepository = require('../repositories/fundAllocation.repository');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');
const { Budget } = require('../models');
const { saveFile } = require('../utils/fileStorage');
const { sequelize } = require('../models');

class PaymentService {
  async createPayment(data, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const address = 'assets/payments';
      if (data.supportingDocument && data.supportingDocument.buffer) {
        data.supportingDocument = await saveFile(
          data.supportingDocument.buffer,
          data.supportingDocument.originalname,
          process.env.BASE_URL,
          address
        );
      }

      // Verify allocation exists and has sufficient funds
      const allocation = await FundAllocationRepository.findById(data.allocationId, userContext);
      if (!allocation) {
        throw new Error('Fund allocation not found');
      }

      if (allocation.status !== 'active') {
        throw new Error('Fund allocation is not active');
      }

      if (parseFloat(data.paymentAmount) > parseFloat(allocation.remainingAmount)) {
        throw new Error('Payment amount exceeds remaining allocation');
      }

      // Verify budget
      const budget = await Budget.findByPk(data.budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      // Check if total payments would exceed budget amount
      const existingPayments = await PaymentRepository.findByQuery(
        { budgetId: data.budgetId, status: 'completed' }, 
        userContext
      );
      
      const totalPaid = existingPayments.data.reduce(
        (sum, payment) => sum + parseFloat(payment.paymentAmount), 0
      );
      
      if (totalPaid + parseFloat(data.paymentAmount) > parseFloat(budget.amount)) {
        throw new Error('Total payments cannot exceed budget amount');
      }

      // Create payment
      const payment = await PaymentRepository.create(data, userContext);

      // Update allocation remaining amount
      const newRemainingAmount = parseFloat(allocation.remainingAmount) - parseFloat(data.paymentAmount);
      const allocationUpdates = {
        remainingAmount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? 'fully_utilized' : 'active'
      };
      
      await FundAllocationRepository.updateById(allocation.id, allocationUpdates, userContext);

      // Create financial transaction
      const transactionData = {
        glId: allocation.glId,
        budgetId: data.budgetId,
        paymentId: payment.id,
        allocationId: data.allocationId,
        transactionType: 'payment',
        debitAmount: data.paymentAmount,
        creditAmount: 0,
        runningBalance: 0,
        description: `Payment for budget ${data.budgetId} - ${data.description || 'Payment'}`
      };

      // Calculate running balance
      const gl = await GeneralLedgerRepository.findById(allocation.glId, userContext);
      transactionData.runningBalance = parseFloat(gl.currentBalance) - parseFloat(data.paymentAmount);

      await FinancialTransactionRepository.create(transactionData, userContext);

      // Update GL balance
      await GeneralLedgerRepository.updateById(
        allocation.glId,
        { currentBalance: transactionData.runningBalance },
        userContext
      );

      // Update budget status if fully paid
      if (totalPaid + parseFloat(data.paymentAmount) >= parseFloat(budget.amount)) {
        await budget.update({ status: 'Closed' });
      }

      await transaction.commit();
      return payment;
    } catch (error) {
      await transaction.rollback();
      console.error({
        service: 'Create Payment Service',
        message: error.message
      });
      // console.error('Error in createPayment service:', error);
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async getPaymentById(id, userContext) {
    try {
      return await PaymentRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getPaymentById service:', error);
      throw new Error(`Failed to get payment: ${error.message}`);
    }
  }

  async searchPayments(queryParams, userContext) {
    try {
      return await PaymentRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchPayments service:', error);
      throw new Error(`Failed to search payments: ${error.message}`);
    }
  }

  async updatePayment(id, updates, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      // Handle file upload for supporting document
      const address = 'assets/payments';
      if (updates.supportingDocument && updates.supportingDocument.buffer) {
        updates.supportingDocument = await saveFile(
          updates.supportingDocument.buffer,
          updates.supportingDocument.originalname,
          process.env.BASE_URL,
          address
        );
      }

      const result = await PaymentRepository.updateById(id, updates, userContext);
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updatePayment service:', error);
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  async getBudgetPaymentSummary(budgetId, userContext) {
    try {
      const budget = await Budget.findByPk(budgetId);
      if (!budget) throw new Error('Budget not found');

      const payments = await PaymentRepository.findByQuery(
        { budgetId, status: 'completed' },
        userContext
      );

      const allocations = await FundAllocationRepository.findByQuery(
        { budgetId },
        userContext
      );

      const totalBudgetAmount = parseFloat(budget.amount);
      const totalPaid = payments.data.reduce(
        (sum, payment) => sum + parseFloat(payment.paymentAmount), 0
      );
      const totalAllocated = allocations.data.reduce(
        (sum, allocation) => sum + parseFloat(allocation.allocatedAmount), 0
      );
      const remainingToAllocate = totalBudgetAmount - totalAllocated;
      const remainingToPay = totalAllocated - totalPaid;

      return {
        budgetId,
        budgetTitle: budget.title,
        totalBudgetAmount,
        totalAllocated,
        totalPaid,
        remainingToAllocate,
        remainingToPay,
        paymentCount: payments.data.length,
        allocationCount: allocations.data.length,
        isFullyPaid: totalPaid >= totalBudgetAmount,
        isFullyAllocated: totalAllocated >= totalBudgetAmount
      };
    } catch (error) {
      console.error('Error in getBudgetPaymentSummary service:', error);
      throw new Error(`Failed to get budget payment summary: ${error.message}`);
    }
  }
}
module.exports = new PaymentService();