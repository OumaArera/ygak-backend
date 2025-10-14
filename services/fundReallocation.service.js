const FundAllocationRepository = require('../repositories/fundAllocation.repository');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');
const FundReallocationRepository = require('../repositories/fundReallocation.repository');
const { Budget } = require('../models');
const { sequelize } = require('../models');

class FundReallocationService {
  async createReallocation(data, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const fromAllocation = await FundAllocationRepository.findById(data.fromAllocationId);
      if (!fromAllocation) {
        throw new Error('Source allocation not found');
      }

      if (parseFloat(data.reallocationAmount) > parseFloat(fromAllocation.remainingAmount)) {
        throw new Error('Reallocation amount exceeds available funds');
      }

      // Verify target budget exists
      const toBudget = await Budget.findByPk(data.toBudgetId);
      if (!toBudget) {
        throw new Error('Target budget not found');
      }

      const reallocation = await FundReallocationRepository.create(data, userContext);
      
      await transaction.commit();
      return reallocation;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in createReallocation service:', error);
      throw new Error(`Failed to create reallocation: ${error.message}`);
    }
  }

  async approveReallocation(id, approvalData, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const reallocation = await FundReallocationRepository.findById(id);
      if (!reallocation) {
        throw new Error('Reallocation not found');
      }

      // Update approval status
      const updates = { ...approvalData };
      
      // Check if both approvals are complete
      const secretaryApproved = updates.secretaryApprovalStatus === 'approved' || 
                               reallocation.secretaryApprovalStatus === 'approved';
      const chairpersonApproved = updates.chairpersonApprovalStatus === 'approved' || 
                                 reallocation.chairpersonApprovalStatus === 'approved';

      if (secretaryApproved && chairpersonApproved) {
        updates.status = 'Approved';
        
        // Process the reallocation
        await this.processReallocation(reallocation, userContext, transaction);
        updates.status = 'Completed';
      }

      const result = await FundReallocationRepository.updateById(id, updates);
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in approveReallocation service:', error);
      throw new Error(`Failed to approve reallocation: ${error.message}`);
    }
  }

  async processReallocation(reallocation, userContext, transaction) {
    // Reduce source allocation
    const fromAllocation = await FundAllocationRepository.findById(reallocation.fromAllocationId);
    const newRemainingAmount = parseFloat(fromAllocation.remainingAmount) - parseFloat(reallocation.reallocationAmount);
    
    await FundAllocationRepository.updateById(
      reallocation.fromAllocationId,
      { 
        remainingAmount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? 'reallocated' : 'active'
      },
    );

    // Create new allocation for target budget
    const newAllocationData = {
      fundRequestId: null,
      budgetId: reallocation.toBudgetId,
      glId: fromAllocation.glId,
      allocatedAmount: reallocation.reallocationAmount
    };

    const newAllocation = await FundAllocationRepository.create(newAllocationData, userContext);

    // Create financial transactions
    // Debit from source
    await FinancialTransactionRepository.create({
      glId: fromAllocation.glId,
      budgetId: fromAllocation.budgetId,
      allocationId: fromAllocation.id,
      transactionType: 'reallocation_debit',
      debitAmount: reallocation.reallocationAmount,
      creditAmount: 0,
      runningBalance: parseFloat(fromAllocation.generalLedger.currentBalance),
      description: `Reallocation from budget ${fromAllocation.budgetId} to ${reallocation.toBudgetId}`
    }, userContext);

    // Credit to target
    await FinancialTransactionRepository.create({
      glId: fromAllocation.glId,
      budgetId: reallocation.toBudgetId,
      allocationId: newAllocation.id,
      transactionType: 'reallocation_credit',
      debitAmount: 0,
      creditAmount: reallocation.reallocationAmount,
      runningBalance: parseFloat(fromAllocation.generalLedger.currentBalance),
      description: `Reallocation from budget ${fromAllocation.budgetId} to ${reallocation.toBudgetId}`
    }, userContext);
  }

  async searchReallocations(queryParams, userContext) {
    try {
      return await FundReallocationRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchReallocations service:', error);
      throw new Error(`Failed to search reallocations: ${error.message}`);
    }
  }
}

module.exports = new FundReallocationService();