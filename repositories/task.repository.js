const { Task, User } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class TaskRepository {
  async create(data) {
    const result = await Task.create(data);

    return result;
  }

  async findById(id) {
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

    return result;
  }

  async updateById(id, updates) {
    const task = await Task.findByPk(id);
    if (!task) return null;

    const result = await task.update(updates);

    return result;
  }

  async deleteById(id) {
    const task = await Task.findByPk(id);
    if (!task) return null;

    await task.destroy();

    return task;
  }
}

module.exports = new TaskRepository();
