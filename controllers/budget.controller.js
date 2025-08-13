const BudgetService = require('../services/budget.service');

class BudgetController {
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        userId: req.user.id,
        invoice: req.files?.invoice ? req.files.invoice[0] : undefined,
        receipt: req.files?.receipt ? req.files.receipt[0] : undefined
      };

      const budget = await BudgetService.createBudget(payload, req.user);
      res.status(201).json({ success: true, data: budget });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const budget = await BudgetService.getBudgetById(req.params.id, req.user);
      if (!budget) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      res.status(200).json({ success: true, data: budget });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const budgets = await BudgetService.searchBudgets(req.query, req.user);
      res.status(200).json({ success: true, data: budgets });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        invoice: req.files?.invoice ? req.files.invoice[0] : undefined,
        receipt: req.files?.receipt ? req.files.receipt[0] : undefined
      };

      const updated = await BudgetService.updateBudget(req.params.id, payload, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await BudgetService.deleteBudget(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      res.status(204).json({ success: true, message: 'Budget deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new BudgetController();
