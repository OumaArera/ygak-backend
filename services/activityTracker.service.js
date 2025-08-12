const activityTrackerRepository = require('../repositories/activityTracker.repository');

class ActivityTrackerService {
  async logActivity({ userId, model, action, description, ipAddress, userAgent }) {
    return await activityTrackerRepository.create({
      userId,
      model,
      action,
      description,
      ipAddress,
      userAgent
    });
  }

  async getActivities(filters) {
    return await activityTrackerRepository.findByFilters(filters);
  }
}

module.exports = new ActivityTrackerService();
