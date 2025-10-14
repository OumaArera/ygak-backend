const { User } = require('../models');

class AuthRepository {
  /**
   * Find a user by email (for login)
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findUserForLogin(email) {
    const result = await User.findOne({ where: { email } });
    
    return result
  }
}

module.exports = new AuthRepository();
