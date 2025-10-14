const eventRepository = require('../repositories/event.repository');
const { saveFile } = require('../utils/fileStorage');

class EventService {
  
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
      return await eventRepository.create(data);
    } catch (error) {
      console.error('Error in createEvent service:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

 
  async getEventById(id, userContext) {
    try {
      const event = await eventRepository.findById(id);
      if (!event) {
        return null; 
      }
      return event;
    } catch (error) {
      console.error('Error in getEventById service:', error);
      throw new Error(`Failed to get event: ${error.message}`);
    }
  }

 
  async searchEvents(queryParams) {
    try {
      return await eventRepository.findByQuery(queryParams);
    } catch (error) {
      console.error('Error in searchEvents service:', error);
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }


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
      const updatedEvent = await eventRepository.updateById(id, updates);
      if (!updatedEvent) {
        throw new Error('Event not found.');
      }
      return updatedEvent;
    } catch (error) {
      console.error('Error in updateEvent service:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }


  async deleteEvent(id, userContext) {
    try {
      const deletedEvent = await eventRepository.deleteById(id);
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