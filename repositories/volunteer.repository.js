const { Volunteer, Institution } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class VolunteerRepository {
  async create(data) {
    const result = await Volunteer.create(data);
    return result;
  }

  async findById(id) {
    const result = await Volunteer.findByPk(id, {
      attributes: { exclude: ['institutionId'] },
      include: [
        {
          model: Institution,
          as: 'institution',
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

    const result = await paginationUtil.paginate(Volunteer, {
      where,
      attributes: { exclude: ['institutionId'] },
      include: [
        {
          model: Institution,
          as: 'institution',
        }
      ],
      page,
      limit
    });

    return result;
  }


  async updateById(id, updates) {
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) return null;

    const result = await volunteer.update(updates);

    return result;
  }

  async deleteById(id) {
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) return null;

    await volunteer.destroy();

    return volunteer;
  }
}

module.exports = new VolunteerRepository();
