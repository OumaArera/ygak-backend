const { Donation } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class DonationRepository {
  
  async create(data) {
    return await Donation.create(data);
  }

 
  async findById(id) {
    const result = await Donation.findByPk(id);
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

    const result = await paginationUtil.paginate(Donation, {
      where,
      page,
      limit
    });
    return result;
  }

  async updateById(id, updates) {
    const donation = await Donation.findByPk(id);
    if (!donation) return null;

    const result = await donation.update(updates);


    return result;
  }

  async deleteById(id) {
    const donation = await Donation.findByPk(id);
    if (!donation) return null;

    await donation.destroy();

    return donation;
  }
}

module.exports = new DonationRepository();
