const { Report, User, Budget, Task } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class ReportRepository {
  async create(data) {
    const result = await Report.create(data);

    return result;
  }

  async findById(id) {
    const result = await Report.findByPk(id, {
      attributes: { exclude: ['userId', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'reportee',
          attributes: { exclude: ['password'] }
        },
        {
          model: Budget,
          as: 'budget'
        },
        {
          model: Task,
          as: 'task'
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

    const result = await paginationUtil.paginate(Report, {
      where,
      attributes: { exclude: ['userId', 'budgetId'] },
      include: [
        {
          model: User,
          as: 'reportee',
          attributes: { exclude: ['password'] }
        },
        {
          model: Budget,
          as: 'budget'
        },
        {
          model: Task,
          as: 'task'
        }
      ],
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const report = await Report.findByPk(id);
    if (!report) return null;

    const result = await report.update(updates);

    return result;
  }

  async deleteById(id) {
    const report = await Report.findByPk(id);
    if (!report) return null;

    await report.destroy();

    return report;
  }
}

module.exports = new ReportRepository();
