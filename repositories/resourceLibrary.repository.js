const { ResourceLibrary } = require('../models'); 
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination'); // Assuming this utility exists

class ResourceLibraryRepository {
 
  /**
   * Creates a new resource.
   */
  async create(data) {
    const result = await ResourceLibrary.create(data);
    return result;
  }

  /**
   * Finds a resource by its primary key (ID).
   */
  async findById(id) {
    const result = await ResourceLibrary.findByPk(id);
    return result;
  }

  /**
   * Searches for resources based on query parameters, with pagination.
   */
  async findByQuery(query) {
    const { page, limit, date, ...filters } = query;
    const where = {};

    // Filter resources by date (e.g., date >= query date)
    if (date) {
        where.date = { [Op.gte]: date };
    }

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        // Apply case-insensitive LIKE for string fields
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(ResourceLibrary, {
      where,
      page,
      limit,
      // Default to ordering by date descending (most recent resources first)
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return result;
  }

 
  /**
   * Updates an existing resource by ID.
   */
  async updateById(id, updates) {
    const resource = await ResourceLibrary.findByPk(id);
    if (!resource) return null;

    const result = await resource.update(updates);
    return result;
  }


  /**
   * Deletes a resource by ID.
   */
  async deleteById(id) {
    const resource = await ResourceLibrary.findByPk(id);
    if (!resource) return null;

    await resource.destroy();
    return resource;
  }
}

module.exports = new ResourceLibraryRepository();