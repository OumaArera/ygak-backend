const FundAllocationRepository = require('../repositories/fundAllocation.repository');
const FundRequestRepository = require('../repositories/fundRequest.repository');
const GeneralLedgerRepository = require('../repositories/generalLedger.repository');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');
const { Budget, FundRequest } = require('../models');
const { sequelize } = require('../models');

class FundAllocationService {
  async createFundAllocation(data, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate fund request exists and is approved
      const fundRequest = await FundRequest.findByPk(data.fundRequestId);
      if (!fundRequest) {
        throw new Error('Fund request not found');
      }

      if (fundRequest.status !== 'Approved') {
        throw new Error('Fund request must be approved before allocation');
      }

      // Validate budget exists
      const budget = await Budget.findByPk(data.budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      // Validate allocation amount doesn't exceed requested amount
      if (parseFloat(data.allocatedAmount) > parseFloat(fundRequest.requestedAmount)) {
        throw new Error('Allocated amount cannot exceed requested amount');
      }

      // Create the fund allocation
      const allocationData = {
        ...data,
        remainingAmount: data.allocatedAmount,
        allocatedBy: userContext.id
      };

      const fundAllocation = await FundAllocationRepository.create(allocationData, userContext);
      
      // Create financial transaction
      await this.createFinancialTransaction(fundAllocation, userContext, transaction);
      
      // Update fund request status to allocated
      await FundRequestRepository.updateById(
        data.fundRequestId, 
        { status: 'Allocated' }, 
        
      );

      await transaction.commit();
      return fundAllocation;
    } catch (error) {
      await transaction.rollback();
      console.error({
        service: 'createFundAllocation',
        message: error.message
      });
      throw new Error(`Failed to create fund allocation: ${error.message}`);
    }
  }

  async getFundAllocationById(id, userContext) {
    try {
      return await FundAllocationRepository.findById(id);
    } catch (error) {
      console.error('Error in getFundAllocationById service:', error);
      throw new Error(`Failed to get fund allocation: ${error.message}`);
    }
  }

  async searchFundAllocations(queryParams, userContext) {
    try {
      return await FundAllocationRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchFundAllocations service:', error);
      throw new Error(`Failed to search fund allocations: ${error.message}`);
    }
  }

  async updateFundAllocation(id, updates, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const fundAllocation = await FundAllocationRepository.findById(id);
      if (!fundAllocation) {
        throw new Error('Fund allocation not found');
      }

      // If updating allocated amount, validate constraints
      if (updates.allocatedAmount !== undefined) {
        const usedAmount = parseFloat(fundAllocation.allocatedAmount) - parseFloat(fundAllocation.remainingAmount);
        
        if (parseFloat(updates.allocatedAmount) < usedAmount) {
          throw new Error('Cannot reduce allocation below the amount already utilized');
        }

        // Update remaining amount proportionally
        updates.remainingAmount = parseFloat(updates.allocatedAmount) - usedAmount;
      }

      const result = await FundAllocationRepository.updateById(id, updates);
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in updateFundAllocation service:', error);
      throw new Error(`Failed to update fund allocation: ${error.message}`);
    }
  }

  async reallocateFunds(id, newBudgetId, newAmount, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const fundAllocation = await FundAllocationRepository.findById(id);
      if (!fundAllocation) {
        throw new Error('Fund allocation not found');
      }

      if (fundAllocation.status !== 'active') {
        throw new Error('Can only reallocate active fund allocations');
      }

      // Validate new budget exists
      const newBudget = await Budget.findByPk(newBudgetId);
      if (!newBudget) {
        throw new Error('New budget not found');
      }

      // Mark current allocation as reallocated
      await FundAllocationRepository.updateById(
        id, 
        { status: 'reallocated' }
      );

      // Create new allocation
      const newAllocationData = {
        fundRequestId: fundAllocation.fundRequestId,
        budgetId: newBudgetId,
        glId: fundAllocation.glId,
        allocatedAmount: newAmount || fundAllocation.remainingAmount,
        allocatedBy: userContext.id
      };

      const newAllocation = await FundAllocationRepository.create(newAllocationData, userContext);
      
      // Create financial transaction for reallocation
      await this.createFinancialTransaction(newAllocation, userContext, transaction);

      await transaction.commit();
      return newAllocation;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in reallocateFunds service:', error);
      throw new Error(`Failed to reallocate funds: ${error.message}`);
    }
  }

  async createFinancialTransaction(allocation, userContext, transaction) {
    const transactionData = {
      glId: allocation.glId,
      budgetId: allocation.budgetId,
      allocationId: allocation.id,
      transactionType: 'fund_allocation',
      debitAmount: 0,
      creditAmount: allocation.allocatedAmount,
      runningBalance: 0,
      description: `Fund allocation for budget ${allocation.budgetId} - Amount: ${allocation.allocatedAmount}`
    };

    // Calculate running balance
    const gl = await GeneralLedgerRepository.findById(allocation.glId);
    transactionData.runningBalance = parseFloat(gl.currentBalance) + parseFloat(allocation.allocatedAmount);

    await FinancialTransactionRepository.create(transactionData, userContext);

    // Update GL balance
    await GeneralLedgerRepository.updateById(
      allocation.glId,
      { currentBalance: transactionData.runningBalance }
    );
  }

  async deleteFundAllocation(id, userContext) {
    const transaction = await sequelize.transaction();
    
    try {
      const fundAllocation = await FundAllocationRepository.findById(id);
      if (!fundAllocation) {
        throw new Error('Fund allocation not found');
      }

      // Check if allocation has been utilized
      if (parseFloat(fundAllocation.remainingAmount) < parseFloat(fundAllocation.allocatedAmount)) {
        throw new Error('Cannot delete allocation that has been partially or fully utilized');
      }

      // Reverse the financial transaction
      const transactionData = {
        glId: fundAllocation.glId,
        budgetId: fundAllocation.budgetId,
        allocationId: fundAllocation.id,
        transactionType: 'fund_allocation_reversal',
        debitAmount: fundAllocation.allocatedAmount,
        creditAmount: 0,
        runningBalance: 0,
        description: `Reversal of fund allocation ${fundAllocation.id}`
      };

      // Calculate new running balance
      const gl = await GeneralLedgerRepository.findById(fundAllocation.glId);
      transactionData.runningBalance = parseFloat(gl.currentBalance) - parseFloat(fundAllocation.allocatedAmount);

      await FinancialTransactionRepository.create(transactionData, userContext);

      // Update GL balance
      await GeneralLedgerRepository.updateById(
        fundAllocation.glId,
        { currentBalance: transactionData.runningBalance },
      );

      // Update fund request status back to approved
      await FundRequestRepository.updateById(
        fundAllocation.fundRequestId,
        { status: 'Approved' },
      );

      // Delete the allocation
      const result = await FundAllocationRepository.deleteById(id);

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in deleteFundAllocation service:', error);
      throw new Error(`Failed to delete fund allocation: ${error.message}`);
    }
  }

  async getFundAllocationSummary(userContext) {
    try {
      const allocations = await FundAllocationRepository.findByQuery({});
      
      const summary = {
        totalAllocations: allocations.data?.length || 0,
        totalAllocatedAmount: 0,
        totalRemainingAmount: 0,
        statusBreakdown: {
          active: 0,
          fully_utilized: 0,
          reallocated: 0
        }
      };

      if (allocations.data) {
        allocations.data.forEach(allocation => {
          summary.totalAllocatedAmount += parseFloat(allocation.allocatedAmount);
          summary.totalRemainingAmount += parseFloat(allocation.remainingAmount);
          summary.statusBreakdown[allocation.status]++;
        });
      }

      return summary;
    } catch (error) {
      console.error('Error in getFundAllocationSummary service:', error);
      throw new Error(`Failed to get fund allocation summary: ${error.message}`);
    }
  }
}

module.exports = new FundAllocationService();