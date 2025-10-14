const { UpcomingProject } = require('../models');
const { Op } = require('sequelize');
const paginationUtil = require('../utils/pagination');

class UpcomingProjectRepository {
 
  /**
   * Creates a new upcoming project.
   */
  async create(data) {
    const result = await UpcomingProject.create(data);
    return result;
  }

  /**
   * Finds an upcoming project by its primary key (ID).
   */
  async findById(id) {
    const result = await UpcomingProject.findByPk(id);
    return result;
  }

  /**
   * Searches for upcoming projects based on query parameters, with pagination.
   */
  async findByQuery(query) {
    const { page, limit, date, ...filters } = query; 
    const where = {};

    if (date) {
      where.date = { [Op.gte]: date };
    }

    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        where[key] = { [Op.iLike]: `%${value}%` };
      } else {
        where[key] = value;
      }
    }

    const result = await paginationUtil.paginate(UpcomingProject, {
      where,
      page,
      limit,
      order: [['date', 'ASC'], ['createdAt', 'DESC']],
    });

    return result;
  }

 
  /**
   * Updates an existing upcoming project by ID.
   */
  async updateById(id, updates) {
    const project = await UpcomingProject.findByPk(id);
    if (!project) return null;

    const result = await project.update(updates);
    return result;
  }


  /**
   * Deletes an upcoming project by ID.
   */
  async deleteById(id) {
    const project = await UpcomingProject.findByPk(id);
    if (!project) return null;

    await project.destroy();
    return project;
  }
}

module.exports = new UpcomingProjectRepository();