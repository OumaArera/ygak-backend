const resourceLibraryService = require('../services/resourceLibrary.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util'); 

class ResourceLibraryController {
  
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        file: req.files?.file ? req.files.file[0] : undefined, 
      };
      const newResource = await resourceLibraryService.createResource(payload);
      res.status(201).json({ success: true, data: newResource });
    } catch (err) {
      console.error('Error in ResourceLibraryController.create:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      if (err.message.includes('file is required')) {
         return res.status(400).json({ success: false, error: err.message });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async getById(req, res) {
    try {
      const resource = await resourceLibraryService.getResourceById(req.params.id);
      if (!resource) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }
      res.status(200).json({ success: true, data: resource });
    } catch (err) {
      console.error('Error in ResourceLibraryController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async search(req, res) {
    try {
      const resources = await resourceLibraryService.searchResources(req.query);
      res.status(200).json({ success: true, data: resources });
    } catch (err) {
      console.error('Error in ResourceLibraryController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        file: req.files?.file ? req.files.file[0] : undefined, 
      };
      const updatedResource = await resourceLibraryService.updateResource(req.params.id, payload);
      
      res.status(200).json({ success: true, data: updatedResource });
    } catch (err) {
      console.error('Error in ResourceLibraryController.update:', err);

      if (err.message.includes('not found')) {
        return res.status(404).json({ success: false, error: err.message });
      }
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async delete(req, res) {
    try {
      await resourceLibraryService.deleteResource(req.params.id);
      res.status(204).json({ success: true, message: 'Resource deleted successfully' });
    } catch (err) {
      console.error('Error in ResourceLibraryController.delete:', err);
      
      if (err.message.includes('not found')) {
        return res.status(404).json({ success: false, error: err.message });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new ResourceLibraryController();