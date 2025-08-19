const newsletterService = require('../services/newsletter.service');
const { successResponse } = require('../utils/response');

class NewsletterController {
  async create(req, res, next) {
    try {
      const newsletter = await newsletterService.createNewsletter(req.body, req.user);
      return successResponse(res, 201, 'Newsletter created successfully', newsletter);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page, limit, searchTerm } = req.query;
      const newsletters = await newsletterService.getAllNewsletters({ page, limit, searchTerm });
      return successResponse(res, 200, 'Newsletters retrieved successfully', newsletters);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const newsletter = await newsletterService.getNewsletterById(req.params.id);
      return successResponse(res, 200, 'Newsletter retrieved successfully', newsletter);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const newsletter = await newsletterService.updateNewsletter(req.params.id, req.body, req.user);
      return successResponse(res, 200, 'Newsletter updated successfully', newsletter);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await newsletterService.deleteNewsletter(req.params.id, req.user);
      return successResponse(res, 200, 'Newsletter deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NewsletterController();
