const activityTrackerService = require('../services/activityTracker.service');

class ActivityTrackerController {
  async getActivities(req, res) {
    try {
      const { startDate, endDate, model, userId } = req.query;
      const activities = await activityTrackerService.getActivities({ startDate, endDate, model, userId });
      res.json({ success: true, data: activities });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ActivityTrackerController();
