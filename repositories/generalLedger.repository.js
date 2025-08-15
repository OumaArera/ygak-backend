const { 
  GeneralLedger, 
  FundAllocation, 
} = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class GeneralLedgerRepository {
  async create(data, userContext) {
    const result = await GeneralLedger.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "GeneralLedger",
      action: 'CREATE',
      description: `Created GL ${data.glCode} - ${data.glName}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async findById(id, userContext) {
    const result = await GeneralLedger.findByPk(id, {
      include: [
        {
          model: FundAllocation,
          as: 'allocations',
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "GeneralLedger",
      action: 'GET',
      description: `Fetched GL with ID: ${id}`,
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

    const result = await paginationUtil.paginate(GeneralLedger, {
      where,
      include: [
        {
          model: FundAllocation,
          as: 'allocations',
        }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "GeneralLedger",
      action: 'GET',
      description: `Queried GLs with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async updateById(id, updates, userContext) {
    const gl = await GeneralLedger.findByPk(id);
    if (!gl) return null;

    const result = await gl.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "GeneralLedger",
      action: 'UPDATE',
      description: `Updated GL ${id}: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  async deleteById(id, userContext) {
    const gl = await GeneralLedger.findByPk(id);
    if (!gl) return null;

    await gl.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "GeneralLedger",
      action: 'DELETE',
      description: `Deleted GL with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return gl;
  }
}


module.exports = new GeneralLedgerRepository();