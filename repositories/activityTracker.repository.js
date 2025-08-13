const ActivityTracker = require('../models/activityTracker.model');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ActivityTrackerRepository {
  async create(activityData) {
    return await ActivityTracker.create(activityData);
  }

  async findByFilters({ startDate, endDate, model, userId, page, limit }) {
    const where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (model) {
      where.model = { [Op.iLike]: `%${model}%` };
    }

    if (userId) {
      where.userId = userId;
    }

    return await paginationUtil.paginate(ActivityTracker, {
      where,
      include: [
        {
          association: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      page,
      limit
    });
  }
}

module.exports = new ActivityTrackerRepository();
