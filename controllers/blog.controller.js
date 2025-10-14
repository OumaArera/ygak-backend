const blogService = require('../services/blog.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util');

class BlogController {
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        coverImage: req.files?.coverImage ? req.files.coverImage[0] : undefined,
      };
      const newBlog = await blogService.createBlog(payload);
      res.status(201).json({ success: true, data: newBlog });
    } catch (err) {
      console.error('Error in BlogController.create:', err);
      const sequelizeErrors = [
        'SequelizeValidationError',
        'SequelizeUniqueConstraintError',
      ];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.status(200).json({ success: true, data: blog });
    } catch (err) {
      console.error('Error in BlogController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const blogs = await blogService.searchBlogs(req.query);
      res.status(200).json({ success: true, data: blogs });
    } catch (err) {
      console.error('Error in BlogController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        coverImage: req.files?.coverImage ? req.files.coverImage[0] : undefined,
      };
      const updatedBlog = await blogService.updateBlog(req.params.id, payload);
      res.status(200).json({ success: true, data: updatedBlog });
    } catch (err) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ success: false, error: err.message });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await blogService.deleteBlog(req.params.id);
      res.status(204).json({ success: true, message: 'Blog deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new BlogController();
