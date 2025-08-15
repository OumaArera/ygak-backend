const GeneralLedgerService = require('../services/generalLedger.service');

class GeneralLedgerController {
  async create(req, res) {
    try {
      const gl = await GeneralLedgerService.createGL(req.body, req.user);
      res.status(201).json({ success: true, data: gl });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const gl = await GeneralLedgerService.getGLById(req.params.id, req.user);
      if (!gl) {
        return res.status(404).json({ success: false, error: 'General Ledger not found' });
      }
      res.status(200).json({ success: true, data: gl });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const gls = await GeneralLedgerService.searchGLs(req.query, req.user);
      res.status(200).json({ success: true, data: gls });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await GeneralLedgerService.updateGL(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'General Ledger not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await GeneralLedgerService.deleteGL(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'General Ledger not found' });
      }
      res.status(204).json({ success: true, message: 'General Ledger deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getBalance(req, res) {
    try {
      const balance = await GeneralLedgerService.getGLBalance(req.params.id, req.user);
      res.status(200).json({ success: true, data: balance });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new GeneralLedgerController();