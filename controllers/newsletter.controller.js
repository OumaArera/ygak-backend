const newsletterService = require('../services/newsletter.service');

class NewsletterController {
  async create(req, res) {
    try {
      const newsletter = await newsletterService.createNewsletter(req.body, req.user);
      res.status(201).json({ success: true, data: newsletter });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const { page, limit, searchTerm } = req.query;
      const newsletters = await newsletterService.getAllNewsletters({ page, limit, searchTerm });
      res.status(200).json({ success: true, data: newsletters });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const newsletter = await newsletterService.getNewsletterById(req.params.id);
      res.status(200).json({ success: true, data: newsletter });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const newsletter = await newsletterService.updateNewsletter(req.params.id, req.body, req.user);
      res.status(200).json({ success: true, data: newsletter });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await newsletterService.deleteNewsletter(req.params.id, req.user);
      res.status(200).json({ success: true, message: 'Newsletter deleted successfully' });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }
}

module.exports = new NewsletterController();
