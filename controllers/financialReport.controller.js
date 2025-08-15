const FinancialReportsService = require('../services/financialTransaction.service');
const FinancialTransactionRepository = require('../repositories/financialTransaction.repository');

class FinancialReportsController {
  async getGLStatement(req, res) {
    try {
      const { glId } = req.params;
      const { dateFrom, dateTo } = req.query;
      
      if (!dateFrom || !dateTo) {
        return res.status(400).json({ 
          success: false, 
          error: 'Date range is required (dateFrom and dateTo)' 
        });
      }

      const statement = await FinancialReportsService.getGLStatement(glId, dateFrom, dateTo, req.user);
      res.status(200).json({ success: true, data: statement });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getBudgetFinancialSummary(req, res) {
    try {
      const summary = await FinancialReportsService.getBudgetFinancialSummary(req.params.budgetId, req.user);
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getAllocationsSummary(req, res) {
    try {
      const summary = await FinancialReportsService.getAllocationsSummary(req.user);
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getDashboard(req, res) {
    try {
      // Get overall financial dashboard
      const allocations = await FinancialReportsService.getAllocationsSummary(req.user);
      
      // Get recent transactions
      const recentTransactions = await FinancialTransactionRepository.findByQuery({
        limit: 10,
        page: 1
      }, req.user);

      const dashboard = {
        allocations: allocations.summary,
        recentTransactions: recentTransactions.data,
        timestamp: new Date().toISOString()
      };

      res.status(200).json({ success: true, data: dashboard });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new FinancialReportsController();