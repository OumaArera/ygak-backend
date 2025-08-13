const { Volunteer, Institution } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class VolunteerRepository {
  async create(data, userContext) {
    const result = await Volunteer.create(data);
    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Volunteer",
      action: 'CREATE',
      description: `Created a new volunteer with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });
    return result;
  }

  async findById(id, userContext) {
    const result = await Volunteer.findByPk(id, {
      attributes: { exclude: ['institutionId'] },
      include: [
        {
          model: Institution,
          as: 'institution',
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Volunteer",
      action: 'GET',
      description: `Fetched volunteer with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findByQuery(query, userContext) {
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Volunteer",
      action: 'GET',
      description: `Queried volunteers with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }


  async updateById(id, updates, userContext) {
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) return null;

    const result = await volunteer.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Volunteer",
      action: 'UPDATE',
      description: `Updated volunteer with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) return null;

    await volunteer.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Volunteer",
      action: 'DELETE',
      description: `Deleted volunteer with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return volunteer;
  }
}

module.exports = new VolunteerRepository();
