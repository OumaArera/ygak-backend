const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - The user data to create
   * @returns {Promise<User>}
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Find a user by ID
   * @param {string} id - UUID of the user
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Find users using dynamic query params
   * Example usage: findByQuery({ email: 'test@example.com', isActive: true })
   * Supports partial matches if `like` option is used.
   *
   * @param {Object} params - Query filters
   * @returns {Promise<User[]>}
   */
  async findByQuery(params = {}) {
    const whereClause = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      // Allow partial match for strings
      if (typeof value === 'string') {
        whereClause[key] = { [Op.iLike]: `%${value}%` };
      } else {
        whereClause[key] = value;
      }
    }

    return await User.findAll({ where: whereClause });
  }

  /**
   * Update user by ID
   * @param {string} id - UUID of the user
   * @param {Object} updates - Data to update
   * @returns {Promise<[number, User[]]>}
   */
  async updateById(id, updates) {
    return await User.update(updates, { where: { id }, returning: true });
  }

  /**
   * Delete user by ID
   * @param {string} id - UUID of the user
   * @returns {Promise<number>} Number of deleted rows
   */
  async deleteById(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
