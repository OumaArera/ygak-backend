const FundAllocationRepository = require('../repositories/fundAllocation.repository');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');
const GeneralLedgerRepository = require('../repositories/generalLedger.repository');

class FinancialReportsService {
  async getGLStatement(glId, dateFrom, dateTo, userContext) {
    try {
      const gl = await GeneralLedgerRepository.findById(glId, userContext);
      if (!gl) throw new Error('General Ledger not found');

      const query = {
        glId,
        transactionDateFrom: dateFrom,
        transactionDateTo: dateTo,
        limit: 1000
      };

      const transactions = await FinancialTransactionRepository.findByQuery(query, userContext);

      return {
        generalLedger: {
          id: gl.id,
          glCode: gl.glCode,
          glName: gl.glName,
          currentBalance: gl.currentBalance
        },
        period: { from: dateFrom, to: dateTo },
        transactions: transactions.data,
        summary: {
          totalDebits: transactions.data.reduce((sum, t) => sum + parseFloat(t.debitAmount), 0),
          totalCredits: transactions.data.reduce((sum, t) => sum + parseFloat(t.creditAmount), 0),
          transactionCount: transactions.data.length
        }
      };
    } catch (error) {
      console.error('Error in getGLStatement service:', error);
      throw new Error(`Failed to generate GL statement: ${error.message}`);
    }
  }

  async getBudgetFinancialSummary(budgetId, userContext) {
    try {
      return await PaymentService.getBudgetPaymentSummary(budgetId, userContext);
    } catch (error) {
      console.error('Error in getBudgetFinancialSummary service:', error);
      throw new Error(`Failed to get budget financial summary: ${error.message}`);
    }
  }

  async getAllocationsSummary(userContext) {
    try {
      const allocations = await FundAllocationRepository.findByQuery({ limit: 1000 }, userContext);
      
      const summary = {
        totalAllocations: allocations.data.length,
        activeAllocations: allocations.data.filter(a => a.status === 'active').length,
        fullyUtilized: allocations.data.filter(a => a.status === 'fully_utilized').length,
        reallocated: allocations.data.filter(a => a.status === 'reallocated').length,
        totalAllocatedAmount: allocations.data.reduce((sum, a) => sum + parseFloat(a.allocatedAmount), 0),
        totalRemainingAmount: allocations.data.reduce((sum, a) => sum + parseFloat(a.remainingAmount), 0)
      };

      return {
        summary,
        allocations: allocations.data
      };
    } catch (error) {
      console.error('Error in getAllocationsSummary service:', error);
      throw new Error(`Failed to get allocations summary: ${error.message}`);
    }
  }
}

module.exports = new FinancialReportsService();