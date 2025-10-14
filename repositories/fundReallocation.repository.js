const { 
  GeneralLedger, 
  FundAllocation, 
  FundReallocation,
  Budget,
  User 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');


class FundReallocationRepository {
  async create(data, userContext) {
    const result = await FundReallocation.create({
      ...data,
      requesterId: userContext.id
    });

    return result;
  }

  async findById(id) {
    const result = await FundReallocation.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: { exclude: ['password'] } },
        { 
          model: FundAllocation, 
          as: 'fromAllocation',
          include: [
            { model: Budget, as: 'budget' },
            { model: GeneralLedger, as: 'generalLedger' }
          ]
        },
        { model: Budget, as: 'toBudget' }
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

    const result = await paginationUtil.paginate(FundReallocation, {
      where,
      include: [
        { model: User, as: 'requester', attributes: { exclude: ['password'] } },
        { 
          model: FundAllocation, 
          as: 'fromAllocation',
          include: [
            { model: Budget, as: 'budget' },
            { model: GeneralLedger, as: 'generalLedger' }
          ]
        },
        { model: Budget, as: 'toBudget' }
      ],
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const fundReallocation = await FundReallocation.findByPk(id);
    if (!fundReallocation) return null;

    const result = await fundReallocation.update(updates);

    return result;
  }

  async deleteById(id) {
    const fundReallocation = await FundReallocation.findByPk(id);
    if (!fundReallocation) return null;

    await fundReallocation.destroy();

    return fundReallocation;
  }
}

module.exports = new FundReallocationRepository();