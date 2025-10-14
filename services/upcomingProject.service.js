const upcomingProjectRepository = require('../repositories/upcomingProject.repository');
const { saveFile } = require('../utils/fileStorage'); 

class UpcomingProjectService {
  
  /**
   * Creates a new upcoming project, handling image upload if present.
   */
  async createProject(data) {
    try {
      const address = 'assets/upcoming-projects';
      if (data.image && data.image.buffer) {
        data.image = await saveFile(
          data.image.buffer,
          data.image.originalname,
          process.env.BASE_URL,
          address
        );
      }
      return await upcomingProjectRepository.create(data);
    } catch (error) {
      console.error('Error in createProject service:', error);
      throw new Error(`Failed to create upcoming project: ${error.message}`);
    }
  }

 
  /**
   * Fetches an upcoming project by ID.
   */
  async getProjectById(id) {
    try {
      const project = await upcomingProjectRepository.findById(id);
      return project;
    } catch (error) {
      console.error('Error in getProjectById service:', error);
      throw new Error(`Failed to get upcoming project: ${error.message}`);
    }
  }

 
  /**
   * Searches for upcoming projects based on query parameters.
   */
  async searchProjects(queryParams) {
    try {
      return await upcomingProjectRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchProjects service:', error);
      throw new Error(`Failed to search upcoming projects: ${error.message}`);
    }
  }


  /**
   * Updates an existing upcoming project, handling new image upload if present.
   */
  async updateProject(id, updates) {
    try {
      const address = 'assets/upcoming-projects';
      if (updates.image && updates.image.buffer) {
        updates.image = await saveFile(
          updates.image.buffer,
          updates.image.originalname,
          process.env.BASE_URL,
          address
        );
      }
      const updatedProject = await upcomingProjectRepository.updateById(id, updates);
      if (!updatedProject) {
        throw new Error('Upcoming Project not found.');
      }
      return updatedProject;
    } catch (error) {
      console.error('Error in updateProject service:', error);
      throw new Error(`Failed to update upcoming project: ${error.message}`);
    }
  }


  /**
   * Deletes an upcoming project by ID.
   */
  async deleteProject(id) {
    try {
      const deletedProject = await upcomingProjectRepository.deleteById(id);
      if (!deletedProject) {
        throw new Error('Upcoming Project not found.');
      }
      return deletedProject;
    } catch (error) {
      console.error('Error in deleteProject service:', error);
      throw new Error(`Failed to delete upcoming project: ${error.message}`);
    }
  }
}

module.exports = new UpcomingProjectService();