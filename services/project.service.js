const projectRepository = require('../repositories/project.repository');

class ProjectService {
  async createProject(data, userContext) {
    try {
      return await projectRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createProject service:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async getProjectById(id, userContext) {
    try {
      return await projectRepository.findById(id);
    } catch (error) {
      console.error('Error in getProjectById service:', error);
      throw new Error(`Failed to get project: ${error.message}`);
    }
  }

  async searchProjects(queryParams, userContext) {
    try {
      return await projectRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchProjects service:', error);
      throw new Error(`Failed to search projects: ${error.message}`);
    }
  }

  async updateProject(id, updates, userContext) {
    try {
      return await projectRepository.updateById(id, updates);
    } catch (error) {
      console.error('Error in updateProject service:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  async deleteProject(id, userContext) {
    try {
      return await projectRepository.deleteById(id);
    } catch (error) {
      console.error('Error in deleteProject service:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }
}

module.exports = new ProjectService();
