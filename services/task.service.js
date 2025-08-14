const taskRepository = require('../repositories/task.repository');

class TaskService {
  async createTask(data, userContext) {
    try {
      return await taskRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createTask service:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async getTaskById(id, userContext) {
    try {
      return await taskRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getTaskById service:', error);
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  async searchTasks(queryParams, userContext) {
    try {
      return await taskRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchTasks service:', error);
      throw new Error(`Failed to search tasks: ${error.message}`);
    }
  }

  async updateTask(id, updates, userContext) {
    try {
      return await taskRepository.updateById(id, updates, userContext);
    } catch (error) {
      console.error('Error in updateTask service:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  async deleteTask(id, userContext) {
    try {
      return await taskRepository.deleteById(id, userContext);
    } catch (error) {
      console.error('Error in deleteTask service:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }
}

module.exports = new TaskService();
