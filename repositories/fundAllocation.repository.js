const { 
  GeneralLedger, 
  FundRequest, 
  FundAllocation, 
  Payment, 
  Budget,
  User 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class FundAllocationRepository {
  async create(data, userContext) {
    const result = await FundAllocation.create({
      ...data,
      allocatedBy: userContext.id,
      remainingAmount: data.allocatedAmount
    });

    return result;
  }

  async findById(id) {
    const result = await FundAllocation.findByPk(id, {
      include: [
        { model: FundRequest, as: 'fundRequest' },
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' },
        { model: User, as: 'allocator', attributes: { exclude: ['password'] } },
        { model: Payment, as: 'payments' }
      ]
    });

    return result;
  }

  async findByQuery(query) {
    const { page, limit, ...filters } = query;
    const where = {};

    const isUUID = (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string' && !isUUID(value)) {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(FundAllocation, {
      where,
      include: [
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' },
        { model: User, as: 'allocator', attributes: { exclude: ['password'] } }
      ],
      page,
      limit
    });


    return result;
  }

  async updateById(id, updates) {
    const allocation = await FundAllocation.findByPk(id);
    if (!allocation) return null;

    const result = await allocation.update(updates);

    return result;
  }

  async deleteById(id) {
    const allocation = await FundAllocation.findByPk(id);
    if (!allocation) return null;

    await allocation.destroy();

    return allocation;
  }
}

module.exports = new FundAllocationRepository();