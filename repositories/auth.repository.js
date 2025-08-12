const { User } = require('../models');
// const { Op } = require('sequelize');

// const userRepository = require('./user.repository');

class AuthRepository {
  /**
   * Find a user by email (for login)
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findUserForLogin(email) {
    return await User.findOne({ where: { email } });
  }
}

module.exports = new AuthRepository();
