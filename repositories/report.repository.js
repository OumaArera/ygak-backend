const { Report, User, Budget } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ReportRepository {
  async create(data, userContext) {
    const result = await Report.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Report",
      action: 'CREATE',
      description: `Created a new report with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Report.findByPk(id, {
      attributes: { exclude: ['userId', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Budget,
          as: 'budget'
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Report",
      action: 'GET',
      description: `Fetched report with ID: ${id}`,
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

    const result = await paginationUtil.paginate(Report, {
      where,
      attributes: { exclude: ['userId', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Budget,
          as: 'budget'
        }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Report",
      action: 'GET',
      description: `Queried reports with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const report = await Report.findByPk(id);
    if (!report) return null;

    const result = await report.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Report",
      action: 'UPDATE',
      description: `Updated report with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const report = await Report.findByPk(id);
    if (!report) return null;

    await report.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Report",
      action: 'DELETE',
      description: `Deleted report with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return report;
  }
}

module.exports = new ReportRepository();
