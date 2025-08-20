const { Inventory, User } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class InventoryRepository {
  /**
   * Creates a new inventory item.
   * @param {object} data - The data for the new inventory item.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory>} The newly created inventory item.
   */
  async create(data, userContext) {
    const result = await Inventory.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Inventory",
      action: 'CREATE',
      description: `Created a new inventory item with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds an inventory item by its primary key.
   * @param {string} id - The UUID of the inventory item.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The inventory item, or null if not found.
   */
  async findById(id, userContext) {
    const result = await Inventory.findByPk(id, {
      attributes: { exclude: ['currentUserId'] },
      include: [
        {
          model: User,
          as: 'currentUser',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Inventory",
      action: 'GET',
      description: `Fetched inventory item with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds inventory items based on a query.
   * @param {object} query - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: Inventory[], count: number}>} Paginated list of inventory items.
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

    const result = await paginationUtil.paginate(Inventory, {
      where,
      attributes: { exclude: ['currentUserId'] },
      include: [
        {
          model: User,
          as: 'currentUser',
          attributes: { exclude: ['password'] }
        }
      ],
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Inventory",
      action: 'GET',
      description: `Queried inventory items with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Updates an existing inventory item.
   * @param {string} id - The UUID of the inventory item to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The updated inventory item, or null if not found.
   */
  async updateById(id, updates, userContext) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    const result = await inventory.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Inventory",
      action: 'UPDATE',
      description: `Updated inventory item with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Deletes an inventory item.
   * @param {string} id - The UUID of the inventory item to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Inventory|null>} The deleted inventory item, or null if not found.
   */
  async deleteById(id, userContext) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    await inventory.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Inventory",
      action: 'DELETE',
      description: `Deleted inventory item with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return inventory;
  }
}

module.exports = new InventoryRepository();
