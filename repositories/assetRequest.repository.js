const { AssetRequest, User, Budget } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class AssetRequestRepository {
 
  async create(data) {
    const result = await AssetRequest.create(data);
    return result;
  }

  async findById(id) {
    const result = await AssetRequest.findByPk(id, {
      attributes: { exclude: ['budgetId', 'requestedBy'] },
      include: [
        {
          model: Budget,
          as: 'budget'
        },
        {
          model: User,
          as: 'requester',
          attributes: { exclude: ['password'] }
        }
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

    const result = await paginationUtil.paginate(AssetRequest, {
      where,
      attributes: { exclude: ['budgetId', 'requestedBy'] },
      include: [
        {
          model: Budget,
          as: 'budget'
        },
        {
          model: User,
          as: 'requester',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    return result;
  }

  async updateById(id, updates) {
    const assetRequest = await AssetRequest.findByPk(id);
    if (!assetRequest) return null;

    const result = await assetRequest.update(updates);


    return result;
  }

  async deleteById(id) {
    const assetRequest = await AssetRequest.findByPk(id);
    if (!assetRequest) return null;

    await assetRequest.destroy();


    return assetRequest;
  }
}

module.exports = new AssetRequestRepository();
