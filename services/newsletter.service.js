const newsletterRepository = require('../repositories/newsletter.repository');
const activityTrackerService = require('./activityTracker.service');
const { NotFoundError } = require('../utils/errors');

class NewsletterService {
  async createNewsletter(newsletterData, creator) {
    const newsletter = await newsletterRepository.create({
      ...newsletterData,
      creatorId: creator.id
    });

    await activityTrackerService.track({
      userId: creator.id,
      model: 'Newsletter',
      action: 'CREATE',
      description: `Created newsletter: ${newsletter.title}`
    });

    return newsletter;
  }

  async getAllNewsletters(query) {
    return await newsletterRepository.findAll(query);
  }

  async getNewsletterById(id) {
    const newsletter = await newsletterRepository.findById(id);
    if (!newsletter) {
      throw new NotFoundError('Newsletter not found');
    }
    return newsletter;
  }

  async updateNewsletter(id, updateData, user) {
    const newsletter = await newsletterRepository.update(id, updateData);
    if (!newsletter) {
      throw new NotFoundError('Newsletter not found');
    }

    await activityTrackerService.track({
      userId: user.id,
      model: 'Newsletter',
      action: 'UPDATE',
      description: `Updated newsletter: ${newsletter.title}`
    });

    return newsletter;
  }

  async deleteNewsletter(id, user) {
    const newsletter = await newsletterRepository.findById(id);
    if (!newsletter) {
      throw new NotFoundError('Newsletter not found');
    }

    const deleted = await newsletterRepository.delete(id);
    if (deleted) {
      await activityTrackerService.track({
        userId: user.id,
        model: 'Newsletter',
        action: 'DELETE',
        description: `Deleted newsletter: ${newsletter.title}`
      });
    }
    return deleted;
  }
}

module.exports = new NewsletterService();
