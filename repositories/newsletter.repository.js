const Newsletter = require('../models/newsletter.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');
const activityTrackerService = require('../services/activityTracker.service');

class NewsletterRepository {
  async create(newsletterData) {
    const newsletter = await Newsletter.create(newsletterData);
    
    await activityTrackerService.track({
      userId: newsletterData.creatorId,
      model: 'Newsletter',
      action: 'CREATE',
      description: `Created newsletter: ${newsletter.title}`
    });

    return newsletter;
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

  async update(id, updateData, user) {
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return null;
    
    const updatedNewsletter = await newsletter.update(updateData);
    
    await activityTrackerService.track({
      userId: user.id,
      model: 'Newsletter',
      action: 'UPDATE',
      description: `Updated newsletter: ${updatedNewsletter.title}`
    });

    return updatedNewsletter;
  }

  async delete(id, user) {
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return false;
    
    const newsletterTitle = newsletter.title;
    await newsletter.destroy();
    
    await activityTrackerService.track({
      userId: user.id,
      model: 'Newsletter',
      action: 'DELETE',
      description: `Deleted newsletter: ${newsletterTitle}`
    });
    
    return true;
  }
}

module.exports = new NewsletterRepository();
