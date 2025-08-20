const eventService = require('../services/event.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util');

class EventController {
  /**
   * Controller method to create a new event.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async create(req, res) {
    try {
      const payload = {
        ...req.body,
        flyer: req.files?.flyer ? req.files.flyer[0] : undefined,
      };
      const newEvent = await eventService.createEvent(payload, req.user);
      res.status(201).json({ success: true, data: newEvent });
    } catch (err) {
      console.error('Error in EventController.create:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to fetch a single event by ID.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async getById(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id, req.user);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.status(200).json({ success: true, data: event });
    } catch (err) {
      console.error('Error in EventController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to search for events.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async search(req, res) {
    try {
      const events = await eventService.searchEvents(req.query);
      res.status(200).json({ success: true, data: events });
    } catch (err) {
      console.error('Error in EventController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to update an existing event.
   * @param {string} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async update(req, res) {
    try {
      const payload = {
        ...req.body,
        flyer: req.files?.flyer ? req.files.flyer[0] : undefined,
      };
      const updatedEvent = await eventService.updateEvent(req.params.id, payload, req.user);
      if (!updatedEvent) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.status(200).json({ success: true, data: updatedEvent });
    } catch (err) {
      console.error('Error in EventController.update:', err);

      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to delete an event.
   * @param {string} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async delete(req, res) {
    try {
      const deletedEvent = await eventService.deleteEvent(req.params.id, req.user);
      if (!deletedEvent) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.status(204).json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
      console.error('Error in EventController.delete:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new EventController();
