const { Task, User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class TaskRepository {
  async create(data, userContext) {
    const result = await Task.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Task",
      action: 'CREATE',
      description: `Created a new task with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await Task.findByPk(id, {
      attributes: { exclude: ['assignedTo'] },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Task",
      action: 'GET',
      description: `Fetched task with ID: ${id}`,
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

    const result = await paginationUtil.paginate(Task, {
      where,
      attributes: { exclude: ['assignedTo'] },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Task",
      action: 'GET',
      description: `Queried tasks with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const task = await Task.findByPk(id);
    if (!task) return null;

    const result = await task.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Task",
      action: 'UPDATE',
      description: `Updated task with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const task = await Task.findByPk(id);
    if (!task) return null;

    await task.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Task",
      action: 'DELETE',
      description: `Deleted task with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return task;
  }
}

module.exports = new TaskRepository();
