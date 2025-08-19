const Newsletter = require('../models/newsletter.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class NewsletterRepository {
  async create(newsletterData) {
    return await Newsletter.create(newsletterData);
  }

  async findAll({ page, limit, searchTerm }) {
    const where = {};
    if (searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { content: { [Op.iLike]: `%${searchTerm}%` } }
      ];
    }

    const { offset, limit: limitValue } = paginationUtil.getPaginationParams(page, limit);

    return await Newsletter.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: limitValue
    });
  }

  async findById(id) {
    return await Newsletter.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
  }

  async update(id, updateData) {
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return null;
    return await newsletter.update(updateData);
  }

  async delete(id) {
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return false;
    await newsletter.destroy();
    return true;
  }
}

module.exports = new NewsletterRepository();
