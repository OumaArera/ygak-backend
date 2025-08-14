const MeetingService = require('../services/meeting.service');

class MeetingController {
  async create(req, res) {
    try {
      const meeting = await MeetingService.createMeeting(req.body, req.user);
      res.status(201).json({ success: true, data: meeting });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const meeting = await MeetingService.getMeetingById(req.params.id, req.user);
      if (!meeting) {
        return res.status(404).json({ success: false, error: 'Meeting not found' });
      }
      res.status(200).json({ success: true, data: meeting });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const meetings = await MeetingService.searchMeetings(req.query, req.user);
      res.status(200).json({ success: true, data: meetings });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await MeetingService.updateMeeting(req.params.id, req.body, req.user);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Meeting not found' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await MeetingService.deleteMeeting(req.params.id, req.user);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Meeting not found' });
      }
      res.status(204).json({ success: true, message: 'Meeting deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new MeetingController();
