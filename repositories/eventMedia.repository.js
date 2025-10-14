const { EventMedia, Event } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class EventMediaRepository {

  async create(data) {
    const result = await EventMedia.create(data);
 

    return result;
  }


  async findById(id) {
    const result = await EventMedia.findByPk(id, {
        attributes: { exclude: ['eventId'] },
        include: [
        {
            model: Event,
            as: 'event'
        }
        ]
    });

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

    const result = await paginationUtil.paginate(EventMedia, {
      where,
      attributes: { exclude: ['eventId'] },
      include: [
        {
            model: Event,
            as: 'event'
        }
      ],
      page,
      limit
    });

    return result;
  }


  async updateById(id, updates) {
    const eventMedia = await EventMedia.findByPk(id);
    if (!eventMedia) return null;

    const result = await eventMedia.update(updates);

    return result;
  }


  async deleteById(id) {
    const eventMedia = await EventMedia.findByPk(id);
    if (!eventMedia) return null;

    await eventMedia.destroy();

    return eventMedia;
  }
}

module.exports = new EventMediaRepository();
