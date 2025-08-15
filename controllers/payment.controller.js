const PaymentService = require('../services/payment.service');

class PaymentController {
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        supportingDocument: req.files?.supportingDocument ? req.files.supportingDocument[0] : undefined
      };

      const payment = await PaymentService.createPayment(payload, req.user);
      res.status(201).json({ success: true, data: payment });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id, req.user);
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }
      res.status(200).json({ success: true, data: payment });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const payments = await PaymentService.searchPayments(req.query, req.user);
      res.status(200).json({ success: true, data: payments });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        supportingDocument: req.files?.supportingDocument ? req.files.supportingDocument[0] : undefined
      };

      const updated = await PaymentService.updatePayment(req.params.id, payload, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getBudgetSummary(req, res) {
    try {
      const summary = await PaymentService.getBudgetPaymentSummary(req.params.budgetId, req.user);
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new PaymentController();