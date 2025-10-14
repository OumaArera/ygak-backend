const { Event } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class EventRepository {
 
  async create(data) {
    const result = await Event.create(data);

    return result;
  }

  async findById(id) {
    const result = await Event.findByPk(id);

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

    const result = await paginationUtil.paginate(Event, {
      where,
      page,
      limit
    });

    return result;
  }

 
  async updateById(id, updates) {
    const event = await Event.findByPk(id);
    if (!event) return null;

    const result = await event.update(updates);

    return result;
  }


  async deleteById(id) {
    const event = await Event.findByPk(id);
    if (!event) return null;

    await event.destroy();


    return event;
  }
}

module.exports = new EventRepository();
