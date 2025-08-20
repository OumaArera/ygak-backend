const { Event } = require('../models');
const activityTrackerService = require('../services/activityTracker.service');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class EventRepository {
  /**
   * Creates a new event.
   * @param {object} data - The data for the new event.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event>} The newly created event.
   */
  async create(data, userContext) {
    const result = await Event.create(data);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Event",
      action: 'CREATE',
      description: `Created a new event with data: ${JSON.stringify(data)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds an event by its primary key.
   * @param {string} id - The UUID of the event.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The event, or null if not found.
   */
  async findById(id, userContext) {
    const result = await Event.findByPk(id);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Event",
      action: 'GET',
      description: `Fetched event with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Finds events based on a query.
   * @param {object} query - The query parameters for filtering and pagination.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<{rows: Event[], count: number}>} Paginated list of events.
   */
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

    const result = await paginationUtil.paginate(Event, {
      where,
      page,
      limit
    });

    return result;
  }

  /**
   * Updates an existing event.
   * @param {string} id - The UUID of the event to update.
   * @param {object} updates - The fields to update.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The updated event, or null if not found.
   */
  async updateById(id, updates, userContext) {
    const event = await Event.findByPk(id);
    if (!event) return null;

    const result = await event.update(updates);

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Event",
      action: 'UPDATE',
      description: `Updated event with ID: ${id}, Payload: ${JSON.stringify(updates)}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return result;
  }

  /**
   * Deletes an event.
   * @param {string} id - The UUID of the event to delete.
   * @param {object} userContext - The user's context for activity logging.
   * @returns {Promise<Event|null>} The deleted event, or null if not found.
   */
  async deleteById(id, userContext) {
    const event = await Event.findByPk(id);
    if (!event) return null;

    await event.destroy();

    await activityTrackerService.logActivity({
      userId: userContext.id,
      model: "Event",
      action: 'DELETE',
      description: `Deleted event with ID: ${id}`,
      ipAddress: userContext.ip,
      userAgent: userContext.userAgent
    });

    return event;
  }
}

module.exports = new EventRepository();
