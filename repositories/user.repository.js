const { User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');


class UserRepository {
 
  async create(userData) {
    const result = await User.create(userData);
    return result
  }

  
  async findById(id) {
    const result = await User.findByPk(id);
    return result;
  }


  async findByQuery(params = {}, ) {
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

    return result;
  }

  async updateById(id, updates) {
    const result = await User.update(updates, { where: { id }, returning: true });
    return result;
  }


  async deleteById(id) {
    const result = await User.destroy({ where: { id } });
    return result;
  }
}

module.exports = new UserRepository();
