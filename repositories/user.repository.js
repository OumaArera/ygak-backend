const { User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');


class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - The user data to create
   * @returns {Promise<User>}
   */
  async create(userData, userContext) {
    const result = await User.create(userData);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "User",
      action: 'CREATE',
      description: `Created a new User ${JSON.stringify(userData)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result
  }

  /**
   * Find a user by ID
   * @param {string} id - UUID of the user
   * @returns {Promise<User|null>}
   */
  async findById(id, userContext) {
    const result = await User.findByPk(id);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "User",
      action: 'GET',
      description: `Get a user of ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }

  /**
   * Find users using dynamic query params
   * Example usage: findByQuery({ email: 'test@example.com', isActive: true })
   * Supports partial matches if `like` option is used.
   *
   * @param {Object} params - Query filters
   * @returns {Promise<User[]>}
   */
  async findByQuery(params = {}, userContext) {
    const { page, limit, ...filters } = params;
    const whereClause = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      // Allow partial match for strings
      if (typeof value === 'string') {
        whereClause[key] = { [Op.iLike]: `%${value}%` };
      } else {
        whereClause[key] = value;
      }
    }

    const result = await paginationUtil.paginate(User, {
      where: whereClause,
      attributes: { exclude: ['password'] },
      page,
      limit
    });

    // const result = await User.findAll({ where: whereClause });
    // await activityTrackerService.logActivity({
    //   userId: userContext.id,
    //   model: "User",
    //   action: 'GET',
    //   description: `Get users ${JSON.stringify(result)}`,
    //   ipAddress: userContext.ip,
    //   userAgent: userContext.userAgent
    // });
    return result;
  }

  /**
   * Update user by ID
   * @param {string} id - UUID of the user
   * @param {Object} updates - Data to update
   * @returns {Promise<[number, User[]]>}
   */
  async updateById(id, updates, userContext) {
    const result = await User.update(updates, { where: { id }, returning: true });
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "User",
      action: 'UPDATE',
      description: `Update user of ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }


  /**
   * Delete user by ID
   * @param {string} id - UUID of the user
   * @returns {Promise<number>} Number of deleted rows
   */
  async deleteById(id, userContext) {
    const result = await User.destroy({ where: { id } });
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "User",
      action: 'DELETE',
      description: `Delete user of ID: ${id}.`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }
}

module.exports = new UserRepository();
