const resourceLibraryRepository = require('../repositories/resourceLibrary.repository');
const { saveFile } = require('../utils/fileStorage'); 

class ResourceLibraryService {
  
  /**
   * Creates a new resource, handling PDF file upload.
   */
  async createResource(data) {
    try {
      const address = 'assets/resources';
      if (!data.file || !data.file.buffer) {
        throw new Error('Resource file (PDF) is required.');
      }
      
      data.file = await saveFile(
        data.file.buffer,
        data.file.originalname,
        process.env.BASE_URL,
        address
      );
      
      return await resourceLibraryRepository.create(data);
    } catch (error) {
      console.error('Error in createResource service:', error);
      throw new Error(`Failed to create resource: ${error.message}`);
    }
  }

 
  /**
   * Fetches a resource by ID.
   */
  async getResourceById(id) {
    try {
      const resource = await resourceLibraryRepository.findById(id);
      return resource;
    } catch (error) {
      console.error('Error in getResourceById service:', error);
      throw new Error(`Failed to get resource: ${error.message}`);
    }
  }

 
  /**
   * Searches for resources based on query parameters.
   */
  async searchResources(queryParams) {
    try {
      return await resourceLibraryRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchResources service:', error);
      throw new Error(`Failed to search resources: ${error.message}`);
    }
  }


  /**
   * Updates an existing resource, handling new file upload if present.
   */
  async updateResource(id, updates) {
    try {
      const address = 'assets/resources';
      if (updates.file && updates.file.buffer) {
        updates.file = await saveFile(
          updates.file.buffer,
          updates.file.originalname,
          process.env.BASE_URL,
          address
        );
      }
      const updatedResource = await resourceLibraryRepository.updateById(id, updates);
      if (!updatedResource) {
        throw new Error('Resource not found.');
      }
      return updatedResource;
    } catch (error) {
      console.error('Error in updateResource service:', error);
      throw new Error(`Failed to update resource: ${error.message}`);
    }
  }


  /**
   * Deletes a resource by ID.
   */
  async deleteResource(id) {
    try {
      const deletedResource = await resourceLibraryRepository.deleteById(id);
      if (!deletedResource) {
        throw new Error('Resource not found.');
      }
      return deletedResource;
    } catch (error) {
      console.error('Error in deleteResource service:', error);
      throw new Error(`Failed to delete resource: ${error.message}`);
    }
  }
}

module.exports = new ResourceLibraryService();