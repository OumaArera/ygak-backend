const { Budget, User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class BudgetRepository {
  async create(data, userContext) {
    const result = await Budget.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Budget",
      action: 'CREATE',
      description: `Created a new budget with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Budget.findByPk(id, {
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          as: 'users', 
          attributes: { exclude: ['password'] }
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Budget",
      action: 'GET',
      description: `Fetched budget with ID: ${id}`,
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

    const result = await paginationUtil.paginate(Budget, {
      where,
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Budget",
      action: 'GET',
      description: `Queried budgets with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }


  async updateById(id, updates, userContext) {
    const budget = await Budget.findByPk(id);
    if (!budget) return null;

    const result = await budget.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Budget",
      action: 'UPDATE',
      description: `Updated budget with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const budget = await Budget.findByPk(id);
    if (!budget) return null;

    await budget.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Budget",
      action: 'DELETE',
      description: `Deleted budget with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return budget;
  }
}

module.exports = new BudgetRepository();
