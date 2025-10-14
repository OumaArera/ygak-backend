const { 
  GeneralLedger, 
  FundRequest, 
  FundAllocation, 
  Budget,
  User 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class FundRequestRepository {
  async create(data, userContext) {
    const result = await FundRequest.create({
      ...data,
      requesterId: userContext.id
    });

    return result;
  }

  async findById(id) {
    const result = await FundRequest.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: { exclude: ['password'] } },
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' },
        { model: FundAllocation, as: 'allocation' }
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

    const result = await paginationUtil.paginate(FundRequest, {
      where,
      include: [
        { model: User, as: 'requester', attributes: { exclude: ['password'] } },
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' }
      ],
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const fundRequest = await FundRequest.findByPk(id);
    if (!fundRequest) return null;

    const result = await fundRequest.update(updates);

    return result;
  }

  async deleteById(id) {
    const fundRequest = await FundRequest.findByPk(id);
    if (!fundRequest) return null;

    await fundRequest.destroy();

    return fundRequest;
  }
}

module.exports = new FundRequestRepository();