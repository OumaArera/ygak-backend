const { Project, User, Budget } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ProjectRepository {
  async create(data, userContext) {
    data.maker = userContext.id
    const result = await Project.create(data);

    return result;
  }

  async findById(id) {
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

    return result;
  }

  async updateById(id, updates) {
    const project = await Project.findByPk(id);
    if (!project) return null;

    const result = await project.update(updates);

    return result;
  }

  async deleteById(id) {
    const project = await Project.findByPk(id);
    if (!project) return null;

    await project.destroy();

    return project;
  }
}

module.exports = new ProjectRepository();
