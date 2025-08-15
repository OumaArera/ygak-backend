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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundReallocation",
      action: 'CREATE',
      description: `Created fund reallocation of ${data.reallocationAmount} from allocation ${data.fromAllocationId} to budget ${data.toBudgetId}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundReallocation",
      action: 'GET',
      description: `Fetched fund reallocation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findByQuery(query, userContext) {
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundReallocation",
      action: 'GET',
      description: `Queried fund reallocations with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const fundReallocation = await FundReallocation.findByPk(id);
    if (!fundReallocation) return null;

    const result = await fundReallocation.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundReallocation",
      action: 'UPDATE',
      description: `Updated fund reallocation ${id}: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const fundReallocation = await FundReallocation.findByPk(id);
    if (!fundReallocation) return null;

    await fundReallocation.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundReallocation",
      action: 'DELETE',
      description: `Deleted fund reallocation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return fundReallocation;
  }
}

module.exports = new FundReallocationRepository();