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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundRequest",
      action: 'CREATE',
      description: `Created fund request for ${data.requestedAmount}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await FundRequest.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: { exclude: ['password'] } },
        { model: Budget, as: 'budget' },
        { model: GeneralLedger, as: 'generalLedger' },
        { model: FundAllocation, as: 'allocation' }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundRequest",
      action: 'GET',
      description: `Fetched fund request with ID: ${id}`,
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundRequest",
      action: 'GET',
      description: `Queried fund requests with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const fundRequest = await FundRequest.findByPk(id);
    if (!fundRequest) return null;

    const result = await fundRequest.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundRequest",
      action: 'UPDATE',
      description: `Updated fund request ${id}: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const fundRequest = await FundRequest.findByPk(id);
    if (!fundRequest) return null;

    await fundRequest.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "FundRequest",
      action: 'DELETE',
      description: `Deleted fund request with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return fundRequest;
  }
}

module.exports = new FundRequestRepository();