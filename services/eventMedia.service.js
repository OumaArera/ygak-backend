const eventMediaRepository = require('../repositories/eventMedia.repository');
const { saveFile } = require('../utils/fileStorage');

class EventMediaService {
 
  async createEventMedia(data, files, userContext) {
    try {
      const payload = {
        eventId: data.eventId,
        description: data.description,
        images: []
      };

      if (files && files.length > 0) {
        const address = 'assets/events';
        const imageUrls = await Promise.all(
          files.map(file =>
            saveFile(file.buffer, file.originalname, process.env.BASE_URL, address)
          )
        );
        payload.images = imageUrls;
      }
      return await eventMediaRepository.create(payload);
    } catch (error) {
      console.error('Error in createEventMedia service:', error);
      throw new Error(`Failed to create event media: ${error.message}`);
    }
  }

 
  async getEventMediaById(id, userContext) {
    try {
      return await eventMediaRepository.findById(id);
    } catch (error) {
      console.error('Error in getEventMediaById service:', error);
      throw new Error(`Failed to get event media: ${error.message}`);
    }
  }

 
  async searchEventMedia(queryParams, userContext) {
    try {
      return await eventMediaRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchEventMedia service:', error);
      throw new Error(`Failed to search event media: ${error.message}`);
    }
  }

 
  async updateEventMedia(id, updates, files, userContext) {
    try {
      const payload = { ...updates };
      if (files && files.length > 0) {
        const address = 'assets/events';
        const imageUrls = await Promise.all(
          files.map(file =>
            saveFile(file.buffer, file.originalname, process.env.BASE_URL, address)
          )
        );
        payload.images = imageUrls;
      }

      const updatedRecord = await eventMediaRepository.updateById(id, payload);
      if (!updatedRecord) {
        throw new Error('Event media not found.');
      }
      return updatedRecord;
    } catch (error) {
      console.error('Error in updateEventMedia service:', error);
      throw new Error(`Failed to update event media: ${error.message}`);
    }
  }

 
  async deleteEventMedia(id, userContext) {
    try {
      const deletedRecord = await eventMediaRepository.deleteById(id);
      if (!deletedRecord) {
        throw new Error('Event media not found.');
      }
      return deletedRecord;
    } catch (error) {
      console.error('Error in deleteEventMedia service:', error);
      throw new Error(`Failed to delete event media: ${error.message}`);
    }
  }
}

module.exports = new EventMediaService();
