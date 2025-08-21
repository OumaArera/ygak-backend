const { Donation } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class DonationRepository {
  /**
   * Creates a new donation record.
   * @param {object} data The donation data.
   * @returns {Promise<object>} The created donation object.
   */
  async create(data) {
    return await Donation.create(data);
  }

  /**
   * Finds a donation by its primary key.
   * @param {string} id The UUID of the donation.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The found donation or null if not found.
   */
  async findById(id, userContext) {
    const result = await Donation.findByPk(id);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Donation",
      action: 'GET',
      description: `Fetched donation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds donations based on a query with filtering and pagination.
   * @param {object} query The query object with filters and pagination parameters.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object>} An object containing the paginated results.
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

    const result = await paginationUtil.paginate(Donation, {
      where,
      page,
      limit
    });

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Donation",
      action: 'GET',
      description: `Queried donations with params: ${JSON.stringify(query)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }


  /**
   * Updates a donation record by its ID.
   * @param {string} id The UUID of the donation.
   * @param {object} updates The updates object.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The updated donation or null if not found.
   */
  async updateById(id, updates, userContext) {
    const donation = await Donation.findByPk(id);
    if (!donation) return null;

    const result = await donation.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Donation",
      action: 'UPDATE',
      description: `Updated donation with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Deletes a donation record by its ID.
   * @param {string} id The UUID of the donation.
   * @param {object} userContext The user context for activity tracking.
   * @returns {Promise<object|null>} The deleted donation or null if not found.
   */
  async deleteById(id, userContext) {
    const donation = await Donation.findByPk(id);
    if (!donation) return null;

    await donation.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Donation",
      action: 'DELETE',
      description: `Deleted donation with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return donation;
  }
}

module.exports = new DonationRepository();
