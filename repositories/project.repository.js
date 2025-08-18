const { Project, User, Budget } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ProjectRepository {
  async create(data, userContext) {
    data.maker = userContext.id
    const result = await Project.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Project",
      action: 'CREATE',
      description: `Created a new project with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Project.findByPk(id, {
      attributes: { exclude: ['maker', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'creator',
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
      model: "Project",
      action: 'GET',
      description: `Fetched project with ID: ${id}`,
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

    const result = await paginationUtil.paginate(Project, {
      where,
      attributes: { exclude: ['maker', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'creator',
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
      model: "Project",
      action: 'GET',
      description: `Queried projects with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const project = await Project.findByPk(id);
    if (!project) return null;

    const result = await project.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Project",
      action: 'UPDATE',
      description: `Updated project with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const project = await Project.findByPk(id);
    if (!project) return null;

    await project.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Project",
      action: 'DELETE',
      description: `Deleted project with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return project;
  }
}

module.exports = new ProjectRepository();
