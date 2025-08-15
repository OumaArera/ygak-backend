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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundAllocation",
      action: 'CREATE',
      description: `Allocated ${data.allocatedAmount} to budget ${data.budgetId}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await FundAllocation.findByPk(id, {
      include: [
        { model: FundRequest, as: 'fundRequest' },
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' },
        { model: User, as: 'allocator', attributes: { exclude: ['password'] } },
        { model: Payment, as: 'payments' }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundAllocation",
      action: 'GET',
      description: `Fetched fund allocation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findByQuery(query, userContext) {
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


    // for (const [key, value] of Object.entries(filters)) {
    //   if (typeof value === 'string') {
    //     where[key] = { [Op.iLike]: `%${value}%` };
    //   } else {
    //     where[key] = value;
    //   }
    // }

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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundAllocation",
      action: 'GET',
      description: `Queried fund allocations with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const allocation = await FundAllocation.findByPk(id);
    if (!allocation) return null;

    const result = await allocation.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundAllocation",
      action: 'UPDATE',
      description: `Updated fund allocation ${id}: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const allocation = await FundAllocation.findByPk(id);
    if (!allocation) return null;

    await allocation.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundAllocation",
      action: 'DELETE',
      description: `Deleted fund allocation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return allocation;
  }
}

module.exports = new FundAllocationRepository();