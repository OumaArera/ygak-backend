const { User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');

class AuthRepository {
  /**
   * Find a user by email (for login)
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findUserForLogin(email, userContext) {
    const result = await User.findOne({ where: { email } });
    await activityTrackerService.logActivity({
      userId: userContext.id ? userContext.id : null,
      model: "User",
      action: "GET",
      description: "Login User",
      ipAddress: userContext.ip ? userContext.ip : null,
      userAgent: userContext.userAgent? userContext.userAgent : null
    });
    return result
  }
}

module.exports = new AuthRepository();
