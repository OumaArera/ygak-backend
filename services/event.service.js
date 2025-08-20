const eventRepository = require('../repositories/event.repository');
const { saveFile } = require('../utils/fileStorage');

class EventService {
  /**
   * Creates a new event.
   * @param {object} data - The data for the new event.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event>} The newly created event.
   */
  async createEvent(data, userContext) {
    try {
      const address = 'assets/events';
      if (data.flyer && data.flyer.buffer) {
        data.flyer = await saveFile(
          data.flyer.buffer,
          data.flyer.originalname,
          process.env.BASE_URL,
          address

        );
      }
      return await eventRepository.create(data, userContext);
    } catch (error) {
      console.error('Error in createEvent service:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  /**
   * Fetches a single event by its ID.
   * @param {string} id - The UUID of the event.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The event, or null if not found.
   */
  async getEventById(id, userContext) {
    try {
      const event = await eventRepository.findById(id, userContext);
      if (!event) {
        return null; 
      }
      return event;
    } catch (error) {
      console.error('Error in getEventById service:', error);
      throw new Error(`Failed to get event: ${error.message}`);
    }
  }

  /**
   * Searches for events based on query parameters.
   * @param {object} queryParams - The query parameters for filtering and pagination.
   * @returns {Promise<{rows: Event[], count: number}>} Paginated list of events.
   */
  async searchEvents(queryParams) {
    try {
      return await eventRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchEvents service:', error);
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }

  /**
   * Updates an existing event.
   * @param {string} id - The UUID of the event to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The updated event, or null if not found.
   */
  async updateEvent(id, updates, userContext) {
    try {
      const address = 'assets/events';
      if (data.flyer && data.flyer.buffer) {
        data.flyer = await saveFile(
          data.flyer.buffer,
          data.flyer.originalname,
          process.env.BASE_URL,
          address

        );
      }
      const updatedEvent = await eventRepository.updateById(id, updates, userContext);
      if (!updatedEvent) {
        throw new Error('Event not found.');
      }
      return updatedEvent;
    } catch (error) {
      console.error('Error in updateEvent service:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  /**
   * Deletes an event.
   * @param {string} id - The UUID of the event to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The deleted event, or null if not found.
   */
  async deleteEvent(id, userContext) {
    try {
      const deletedEvent = await eventRepository.deleteById(id, userContext);
      if (!deletedEvent) {
        throw new Error('Event not found.');
      }
      return deletedEvent;
    } catch (error) {
      console.error('Error in deleteEvent service:', error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }
}

module.exports = new EventService();