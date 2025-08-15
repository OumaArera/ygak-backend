const GeneralLedgerRepository = require('../repositories/generalLedger.repository');
const FundRequestRepository = require('../repositories/fundRequest.repository');
const FundAllocationRepository = require('../repositories/fundAllocation.repository');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');
const { Budget } = require('../models');
const { sequelize } = require('../models');


class FundRequestService {
  async createFundRequest(data, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const budget = await Budget.findByPk(data.budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      if (parseFloat(data.requestedAmount) > parseFloat(budget.amount)) {
        throw new Error('Requested amount cannot exceed budget amount');
      }

      const fundRequest = await FundRequestRepository.create(data, userContext);
      
      await transaction.commit();
      return fundRequest;
    } catch (error) {
      await transaction.rollback();
      console.error({
        service: 'createFundRequest',
        message: error.message
      });
      throw new Error(`Failed to create fund request: ${error.message}`);
    }
  }

  async getFundRequestById(id, userContext) {
    try {
      return await FundRequestRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getFundRequestById service:', error);
      throw new Error(`Failed to get fund request: ${error.message}`);
    }
  }

  async searchFundRequests(queryParams, userContext) {
    try {
      return await FundRequestRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchFundRequests service:', error);
      throw new Error(`Failed to search fund requests: ${error.message}`);
    }
  }

  async updateFundRequest(id, updates, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const fundRequest = await FundRequestRepository.findById(id, userContext);
      if (!fundRequest) {
        throw new Error('Fund request not found');
      }

      // Check approval statuses
      const secretaryApproved = updates.secretaryApprovalStatus === 'approved' || fundRequest.secretaryApprovalStatus === 'approved';
      const chairpersonApproved = updates.chairpersonApprovalStatus === 'approved' || fundRequest.chairpersonApprovalStatus === 'approved';
      
      // If either approves and current status is not Approved, set it
      if ((secretaryApproved || chairpersonApproved) && fundRequest.status !== 'Approved') {
        updates.status = 'Approved';
      }

      // If status becomes Approved now, create allocation
      if (updates.status === 'Approved' && fundRequest.status !== 'Approved') {
        await this.createAllocationFromRequest(fundRequest, userContext, transaction);
        updates.status = 'Allocated'; // allocation sets it to Allocated
      }

      const result = await FundRequestRepository.updateById(id, updates, userContext);

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updateFundRequest service:', error);
      throw new Error(`Failed to update fund request: ${error.message}`);
    }
  }

  async createAllocationFromRequest(fundRequest, userContext, transaction) {
    // Create fund allocation
    const allocationData = {
      fundRequestId: fundRequest.id,
      budgetId: fundRequest.budgetId,
      glId: fundRequest.glId,
      allocatedAmount: fundRequest.requestedAmount
    };
    
    const allocation = await FundAllocationRepository.create(allocationData, userContext);
    
    // Create financial transaction
    const transactionData = {
      glId: fundRequest.glId,
      budgetId: fundRequest.budgetId,
      allocationId: allocation.id,
      transactionType: 'fund_allocation',
      debitAmount: 0,
      creditAmount: fundRequest.requestedAmount,
      runningBalance: 0, 
      description: `Fund allocation for budget ${fundRequest.budgetId} - ${fundRequest.purpose}`
    };
    
    // Calculate running balance
    const gl = await GeneralLedgerRepository.findById(fundRequest.glId, userContext);
    transactionData.runningBalance = parseFloat(gl.currentBalance) + parseFloat(fundRequest.requestedAmount);
    
    await FinancialTransactionRepository.create(transactionData, userContext);
    
    // Update GL balance
    await GeneralLedgerRepository.updateById(
      fundRequest.glId, 
      { currentBalance: transactionData.runningBalance }, 
      userContext
    );
    
    return allocation;
  }
}

module.exports = new FundRequestService();