const { EventRegister } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class EventRegisterRepository {
  async create(data) {
    return await EventRegister.create(data);
  }

  async findByQuery(query) {
  const { page, limit, ...filters } = query;
  const where = {};

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string') {
      if (key === 'eventId' || key === 'id') {
        where[key] = value; 
      } else {
        where[key] = { [Op.iLike]: `%${value}%` };
      }
    } else {
      where[key] = value;
    }
  }

  return await paginationUtil.paginate(EventRegister, { where, page, limit });
}


  async findById(id) {
    return await EventRegister.findByPk(id);
  }

  async deleteById(id) {
    const record = await EventRegister.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  }
}

module.exports = new EventRegisterRepository();
