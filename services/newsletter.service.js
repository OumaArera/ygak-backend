const newsletterRepository = require('../repositories/newsletter.repository');

class NewsletterService {
  async createNewsletter(newsletterData, creator) {
    try {
      return await newsletterRepository.create({
        ...newsletterData,
        creatorId: creator.id
      });
    } catch (error) {
      console.error('Error in createNewsletter service:', error);
      throw new Error(`Failed to create newsletter: ${error.message}`);
    }
  }

  async getAllNewsletters(query) {
    try {
      return await newsletterRepository.findAll(query);
    } catch (error) {
      console.error('Error in getAllNewsletters service:', error);
      throw new Error(`Failed to get newsletters: ${error.message}`);
    }
  }

  async getNewsletterById(id) {
    try {
      const newsletter = await newsletterRepository.findById(id);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }
      return newsletter;
    } catch (error) {
      console.error('Error in getNewsletterById service:', error);
      throw new Error(error.message);
    }
  }

  async updateNewsletter(id, updateData, user) {
    try {
      const newsletter = await newsletterRepository.update(id, updateData, user);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }
      return newsletter;
    } catch (error) {
      console.error('Error in updateNewsletter service:', error);
      throw new Error(error.message);
    }
  }

  async deleteNewsletter(id, user) {
    try {
      const newsletter = await newsletterRepository.findById(id);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      return await newsletterRepository.delete(id, user);
    } catch (error) {
      console.error('Error in deleteNewsletter service:', error);
      throw new Error(`Failed to delete newsletter: ${error.message}`);
    }
  }
}

module.exports = new NewsletterService();
