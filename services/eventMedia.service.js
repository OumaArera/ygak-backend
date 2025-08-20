const eventMediaRepository = require('../repositories/eventMedia.repository');
const { saveFile } = require('../utils/fileStorage');

class EventMediaService {
  /**
   * Creates a new event media record.
   * @param {object} data - The data for the new event media.
   * @param {Array<object>} files - An array of image files from multer.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia>} The newly created event media record.
   */
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
      return await eventMediaRepository.create(payload, userContext);
    } catch (error) {
      console.error('Error in createEventMedia service:', error);
      throw new Error(`Failed to create event media: ${error.message}`);
    }
  }

  /**
   * Fetches a single event media record by its ID.
   * @param {string} id - The UUID of the event media record.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The event media record, or null if not found.
   */
  async getEventMediaById(id, userContext) {
    try {
      return await eventMediaRepository.findById(id, userContext);
    } catch (error) {
      console.error('Error in getEventMediaById service:', error);
      throw new Error(`Failed to get event media: ${error.message}`);
    }
  }

  /**
   * Searches for event media records based on query parameters.
   * @param {object} queryParams - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: EventMedia[], count: number}>} Paginated list of event media records.
   */
  async searchEventMedia(queryParams, userContext) {
    try {
      return await eventMediaRepository.findByQuery(queryParams, userContext);
    } catch (error) {
      console.error('Error in searchEventMedia service:', error);
      throw new Error(`Failed to search event media: ${error.message}`);
    }
  }

  /**
   * Updates an existing event media record.
   * @param {string} id - The UUID of the event media record to update.
   * @param {object} updates - The fields to update, including a potential new array of images.
   * @param {Array<object>} files - An array of new image files from multer.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The updated event media record, or null if not found.
   */
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

      const updatedRecord = await eventMediaRepository.updateById(id, payload, userContext);
      if (!updatedRecord) {
        throw new Error('Event media not found.');
      }
      return updatedRecord;
    } catch (error) {
      console.error('Error in updateEventMedia service:', error);
      throw new Error(`Failed to update event media: ${error.message}`);
    }
  }

  /**
   * Deletes an event media record.
   * @param {string} id - The UUID of the event media record to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The deleted event media record, or null if not found.
   */
  async deleteEventMedia(id, userContext) {
    try {
      const deletedRecord = await eventMediaRepository.deleteById(id, userContext);
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
