const ProjectService = require('../services/project.service');

class ProjectController {
  async create(req, res) {
    try {
      const project = await ProjectService.createProject(req.body, req.user);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      console.error('Error in ProjectController.create:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const project = await ProjectService.getProjectById(req.params.id, req.user);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      res.status(200).json({ success: true, data: project });
    } catch (err) {
      console.error('Error in ProjectController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const projects = await ProjectService.searchProjects(req.query, req.user);
      res.status(200).json({ success: true, data: projects });
    } catch (err) {
      console.error('Error in ProjectController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await ProjectService.updateProject(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Error in ProjectController.update:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await ProjectService.deleteProject(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      res.status(204).json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
      console.error('Error in ProjectController.delete:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new ProjectController();
