const { Meeting } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class MeetingRepository {
  async create(data, userContext) {
    const result = await Meeting.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Meeting",
      action: 'CREATE',
      description: `Created a new meeting with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Meeting.findByPk(id);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Meeting",
      action: 'GET',
      description: `Fetched meeting with ID: ${id}`,
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

    const result = await paginationUtil.paginate(Meeting, {
      where,
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Meeting",
      action: 'GET',
      description: `Queried meetings with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) return null;

    const result = await meeting.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Meeting",
      action: 'UPDATE',
      description: `Updated meeting with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) return null;

    await meeting.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Meeting",
      action: 'DELETE',
      description: `Deleted meeting with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return meeting;
  }
}

module.exports = new MeetingRepository();
