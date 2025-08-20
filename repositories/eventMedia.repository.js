const { EventMedia, Event } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class EventMediaRepository {
  /**
   * Creates a new event media record.
   * @param {object} data - The data for the new event media record.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia>} The newly created event media record.
   */
  async create(data, userContext) {
    const result = await EventMedia.create(data);
    if (userContext) {
      await activityTrackerService.logActivity({
        userId: userContext.id,
        model: "EventMedia",
        action: 'CREATE',
        description: `Created new event media for event ID: ${data.eventId}`,
        ipAddress: userContext.ip,
        userAgent: userContext.userAgent
      });
    }

    return result;
  }

  /**
   * Finds an event media record by its primary key.
   * @param {string} id - The UUID of the event media record.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The event media record, or null if not found.
   */
  async findById(id, userContext) {
    const result = await EventMedia.findByPk(id, {
        attributes: { exclude: ['eventId'] },
        include: [
        {
            model: Event,
            as: 'event'
        }
        ]
    });

    if (userContext) {
      await activityTrackerService.logActivity({
        userId: userContext.id,
        model: "EventMedia",
        action: 'GET',
        description: `Fetched event media with ID: ${id}`,
        ipAddress: userContext.ip,
        userAgent: userContext.userAgent
      });
    }

    return result;
  }

  /**
   * Finds event media records based on a query.
   * @param {object} query - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: EventMedia[], count: number}>} Paginated list of event media records.
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

    const result = await paginationUtil.paginate(EventMedia, {
      where,
      attributes: { exclude: ['eventId'] },
      include: [
        {
            model: Event,
            as: 'event'
        }
      ],
      page,
      limit
    });

    if (userContext) {
      await activityTrackerService.logActivity({
        userId: userContext.id,
        model: "EventMedia",
        action: 'GET',
        description: `Queried event media records with params: ${JSON.stringify(query)}`,
        ipAddress: userContext.ip,
        userAgent: userContext.userAgent
      });
    }

    return result;
  }

  /**
   * Updates an existing event media record.
   * @param {string} id - The UUID of the event media record to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The updated event media record, or null if not found.
   */
  async updateById(id, updates, userContext) {
    const eventMedia = await EventMedia.findByPk(id);
    if (!eventMedia) return null;

    const result = await eventMedia.update(updates);

    if (userContext) {
      await activityTrackerService.logActivity({
        userId: userContext.id,
        model: "EventMedia",
        action: 'UPDATE',
        description: `Updated event media with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
        ipAddress: userContext.ip,
        userAgent: userContext.userAgent
      });
    }

    return result;
  }

  /**
   * Deletes an event media record.
   * @param {string} id - The UUID of the event media record to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<EventMedia|null>} The deleted event media record, or null if not found.
   */
  async deleteById(id, userContext) {
    const eventMedia = await EventMedia.findByPk(id);
    if (!eventMedia) return null;

    await eventMedia.destroy();

    if (userContext) {
      await activityTrackerService.logActivity({
        userId: userContext.id,
        model: "EventMedia",
        action: 'DELETE',
        description: `Deleted event media with ID: ${id}`,
        ipAddress: userContext.ip,
        userAgent: userContext.userAgent
      });
    }

    return eventMedia;
  }
}

module.exports = new EventMediaRepository();
