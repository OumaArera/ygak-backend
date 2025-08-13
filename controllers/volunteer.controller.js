const VolunteerService = require('../services/volunteer.service');

class VolunteerController {
  async create(req, res) {
    try {
      const volunteer = await VolunteerService.createVolunteer(req.body, req.user);
      res.status(201).json({success: true, data:volunteer});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async getById(req, res) {
    try {
      const volunteer = await VolunteerService.getVolunteerById(req.params.id, req.user);
      if (!volunteer) {
        return res.status(404).json({success: false, error: 'Volunteer not found' });
      }
      res.status(200).json({success: true, data:volunteer});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async search(req, res) {
    try {
      const volunteers = await VolunteerService.searchVolunteers(req.query, req.user);
      res.status(200).json({success: true, data:volunteers});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async update(req, res) {
    try {
      const updated = await VolunteerService.updateVolunteer(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({success: false, error: 'Volunteer not found' });
      }
      res.status(200).json({success: true, data:updated});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  async delete(req, res) {
    try {
      const deleted = await VolunteerService.deleteVolunteer(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({success: false, error: 'Volunteer not found' });
      }
      res.status(204).json({success: true, error: 'Volunteer deleted successfully' });
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }
}

module.exports = new VolunteerController();
