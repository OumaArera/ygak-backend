const ReportService = require('../services/report.service');

class ReportController {
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        userId: req.user.id,
        content: req.files?.content ? req.files.content[0] : undefined
      };

      const report = await ReportService.createReport(payload, req.user);
      res.status(201).json({ success: true, data: report });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const report = await ReportService.getReportById(req.params.id, req.user);
      if (!report) {
        return res.status(404).json({ success: false, error: 'Report not found' });
      }
      res.status(200).json({ success: true, data: report });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const reports = await ReportService.searchReports(req.query, req.user);
      res.status(200).json({ success: true, data: reports });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        content: req.files?.content ? req.files.content[0] : undefined
      };

      const updated = await ReportService.updateReport(req.params.id, payload, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Report not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await ReportService.deleteReport(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Report not found' });
      }
      res.status(204).json({ success: true, message: 'Report deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new ReportController();
