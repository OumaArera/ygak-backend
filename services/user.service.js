const userRepository = require('../repositories/user.repository');
const generateRegistrationNumber = require('../utils/regNumberGenerator');
const { generateRandomPassword } = require('../utils/generatePassword');

class UserService {
  /**
   * Create a new user
   */
  async createUser(userData, userContext) {
    const password = generateRandomPassword();
    console.log("Password: ", password)
    // Check and assign regNumber
    let regNumber = userData.regNumber;
    if (!regNumber || regNumber.trim() === '') {
      regNumber = await generateRegistrationNumber();
    }

    // Create user with all original data, but override regNumber & password
    return await userRepository.create({
      ...userData,
      regNumber,
      password
    }, userContext);
  }

  /**
   * Get a user by ID
   */
  async getUserById(id, userContext) {
    return await userRepository.findById(id, userContext);
  }

  /**
   * Search users based on query params
   */
  async searchUsers(queryParams, userContext) {
    return await userRepository.findByQuery(queryParams, userContext);
  }

  /**
   * Update a user
   */
  async updateUser(id, updates, userContext) {
    return await userRepository.updateById(id, updates, userContext);
  }

  /**
   * Delete a user
   */
  async deleteUser(id, userContext) {
    return await userRepository.deleteById(id, userContext);
  }
}

module.exports = new UserService();
