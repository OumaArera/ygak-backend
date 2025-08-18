const { AssetRequest, User, Budget } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class AssetRequestRepository {
  /**
   * Creates a new asset request.
   * @param {object} data - The data for the new asset request.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest>} The newly created asset request.
   */
  async create(data, userContext) {
    data.requestedBy = userContext.id
    const result = await AssetRequest.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "AssetRequest",
      action: 'CREATE',
      description: `Created a new asset request with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds an asset request by its primary key.
   * @param {string} id - The UUID of the asset request.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The asset request, or null if not found.
   */
  async findById(id, userContext) {
    const result = await AssetRequest.findByPk(id, {
      attributes: { exclude: ['budgetId', 'requestedBy', 'budget_id', 'requested_by'] },
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "AssetRequest",
      action: 'GET',
      description: `Fetched asset request with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds asset requests based on a query.
   * @param {object} query - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: AssetRequest[], count: number}>} Paginated list of asset requests.
   */
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

    const result = await paginationUtil.paginate(AssetRequest, {
      where,
      attributes: { exclude: ['budgetId', 'requestedBy', 'budget_id', 'requested_by'] },
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

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "AssetRequest",
      action: 'GET',
      description: `Queried asset requests with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Updates an existing asset request.
   * @param {string} id - The UUID of the asset request to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The updated asset request, or null if not found.
   */
  async updateById(id, updates, userContext) {
    const assetRequest = await AssetRequest.findByPk(id);
    if (!assetRequest) return null;

    const result = await assetRequest.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "AssetRequest",
      action: 'UPDATE',
      description: `Updated asset request with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Deletes an asset request.
   * @param {string} id - The UUID of the asset request to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<AssetRequest|null>} The deleted asset request, or null if not found.
   */
  async deleteById(id, userContext) {
    const assetRequest = await AssetRequest.findByPk(id);
    if (!assetRequest) return null;

    await assetRequest.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "AssetRequest",
      action: 'DELETE',
      description: `Deleted asset request with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return assetRequest;
  }
}

module.exports = new AssetRequestRepository();
