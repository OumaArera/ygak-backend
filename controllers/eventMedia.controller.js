const eventMediaService = require('../services/eventMedia.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util');

class EventMediaController {
  /**
   * Controller method to create a new event media record.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async create(req, res) {
    try {
      const files = req.files?.images;
      const newEventMedia = await eventMediaService.createEventMedia(req.body, files, req.user);
      res.status(201).json({ success: true, data: newEventMedia });
    } catch (err) {
      console.error('Error in EventMediaController.create:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to fetch a single event media record by ID.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async getById(req, res) {
    try {
      const eventMedia = await eventMediaService.getEventMediaById(req.params.id, req.user);
      if (!eventMedia) {
        return res.status(404).json({ success: false, error: 'Event media not found' });
      }
      res.status(200).json({ success: true, data: eventMedia });
    } catch (err) {
      console.error('Error in EventMediaController.getById:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to search for event media records.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async search(req, res) {
    try {
      const eventMedia = await eventMediaService.searchEventMedia(req.query, req.user);
      res.status(200).json({ success: true, data: eventMedia });
    } catch (err) {
      console.error('Error in EventMediaController.search:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to update an existing event media record.
   * @param {string} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async update(req, res) {
    try {
      const files = req.files?.images;
      const updatedRecord = await eventMediaService.updateEventMedia(req.params.id, req.body, files, req.user);
      if (!updatedRecord) {
        return res.status(404).json({ success: false, error: 'Event media not found' });
      }
      res.status(200).json({ success: true, data: updatedRecord });
    } catch (err) {
      console.error('Error in EventMediaController.update:', err);

      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Controller method to delete an event media record.
   * @param {string} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  async delete(req, res) {
    try {
      const deletedRecord = await eventMediaService.deleteEventMedia(req.params.id, req.user);
      if (!deletedRecord) {
        return res.status(404).json({ success: false, error: 'Event media not found' });
      }
      res.status(204).json({ success: true, message: 'Event media deleted successfully' });
    } catch (err) {
      console.error('Error in EventMediaController.delete:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new EventMediaController();
