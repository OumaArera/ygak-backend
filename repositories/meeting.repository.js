const { Meeting } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class MeetingRepository {
  async create(data) {
    const result = await Meeting.create(data);

    return result;
  }

  async findById(id) {
    const result = await Meeting.findByPk(id);

    return result;
  }

  async findByQuery(query) {
    const { page, limit, ...filters } = query;
    const where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(Meeting, {
      where,
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) return null;

    const result = await meeting.update(updates);

    return result;
  }

  async deleteById(id) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) return null;

    await meeting.destroy();

    return meeting;
  }
}

module.exports = new MeetingRepository();
