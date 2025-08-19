const newsletterRepository = require('../repositories/newsletter.repository');
const { NotFoundError } = require('../utils/errors');

class NewsletterService {
  async createNewsletter(newsletterData, creator) {
    return await newsletterRepository.create({
      ...newsletterData,
      creatorId: creator.id
    });
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
    const newsletter = await newsletterRepository.update(id, updateData, user);
    if (!newsletter) {
      throw new NotFoundError('Newsletter not found');
    }
    return newsletter;
  }

  async deleteNewsletter(id, user) {
    const newsletter = await newsletterRepository.findById(id);
    if (!newsletter) {
      throw new NotFoundError('Newsletter not found');
    }

    return await newsletterRepository.delete(id, user);
  }
}

module.exports = new NewsletterService();
