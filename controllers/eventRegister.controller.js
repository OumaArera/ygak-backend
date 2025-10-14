const EventRegisterService = require('../services/eventRegister.service');

class EventRegisterController {
  async create(req, res) {
    try {
      const result = await EventRegisterService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Successfully registered for event',
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  async getAll(req, res) {
    try {
      const result = await EventRegisterService.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: 'Event registrations retrieved successfully',
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const result = await EventRegisterService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await EventRegisterService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Registration deleted successfully',
        data: result,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new EventRegisterController();
