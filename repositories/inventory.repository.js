const { Inventory, User } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class InventoryRepository {

  async create(data) {
    const result = await Inventory.create(data);

    return result;
  }

  async findById(id) {
    const result = await Inventory.findByPk(id, {
      attributes: { exclude: ['currentUserId'] },
      include: [
        {
          model: User,
          as: 'currentUser',
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

    const result = await paginationUtil.paginate(Inventory, {
      where,
      attributes: { exclude: ['currentUserId'] },
      include: [
        {
          model: User,
          as: 'currentUser',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    return result;
  }


  async updateById(id, updates) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    const result = await inventory.update(updates);

    return result;
  }


  async deleteById(id) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    await inventory.destroy();

    return inventory;
  }
}

module.exports = new InventoryRepository();
