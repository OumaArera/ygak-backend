const upcomingProjectService = require('../services/upcomingProject.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util'); 

class UpcomingProjectController {
  
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        image: req.files?.image ? req.files.image[0] : undefined, 
      };
      const newProject = await upcomingProjectService.createProject(payload);
      res.status(201).json({ success: true, data: newProject });
    } catch (err) {
      console.error('Error in UpcomingProjectController.create:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async getById(req, res) {
    try {
      const project = await upcomingProjectService.getProjectById(req.params.id,);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Upcoming Project not found' });
      }
      res.status(200).json({ success: true, data: project });
    } catch (err) {
      console.error('Error in UpcomingProjectController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async search(req, res) {
    try {
      const projects = await upcomingProjectService.searchProjects(req.query);
      res.status(200).json({ success: true, data: projects });
    } catch (err) {
      console.error('Error in UpcomingProjectController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  
  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        image: req.files?.image ? req.files.image[0] : undefined, 
      };
      const updatedProject = await upcomingProjectService.updateProject(req.params.id, payload);
      
      res.status(200).json({ success: true, data: updatedProject });
    } catch (err) {
      console.error('Error in UpcomingProjectController.update:', err);

      // Handle specific error types
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
      await upcomingProjectService.deleteProject(req.params.id);
      res.status(204).json({ success: true, message: 'Upcoming Project deleted successfully' });
    } catch (err) {
      console.error('Error in UpcomingProjectController.delete:', err);
      
      if (err.message.includes('not found')) {
        return res.status(404).json({ success: false, error: err.message });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new UpcomingProjectController();