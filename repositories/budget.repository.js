const { Budget, User } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class BudgetRepository {
  async create(data) {
    const result = await Budget.create(data);

    return result;
  }

  async findById(id) {
    const result = await Budget.findByPk(id, {
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          as: 'requestee', 
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

    const result = await paginationUtil.paginate(Budget, {
      where,
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          as: 'requestee',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    return result;
  }


  async updateById(id, updates) {
    const budget = await Budget.findByPk(id);
    if (!budget) return null;

    const result = await budget.update(updates);

    return result;
  }

  async deleteById(id) {
    const budget = await Budget.findByPk(id);
    if (!budget) return null;

    await budget.destroy();

    return budget;
  }
}

module.exports = new BudgetRepository();
