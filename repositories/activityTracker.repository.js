const ActivityTracker = require('../models/activityTracker.model');
const { Op } = require('sequelize');

class ActivityTrackerRepository {
  async create(activityData) {
    return await ActivityTracker.create(activityData);
  }

  async findByFilters({ startDate, endDate, model, userId }) {
    const where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (model) {
      where.model = model;
    }

    if (userId) {
      where.userId = userId;
    }

    return await ActivityTracker.findAll({
      where,
      include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
  }
}

module.exports = new ActivityTrackerRepository();
