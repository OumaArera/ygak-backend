const userRepository = require('../repositories/user.repository');
const generateRegistrationNumber = require('../utils/regNumberGenerator');
const { generateRandomPassword } = require('../utils/generatePassword');

class UserService {
  /**
   * Create a new user
   */
  async createUser(userData) {
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
    });
  }

  /**
   * Get a user by ID
   */
  async getUserById(id) {
    return await userRepository.findById(id);
  }

  /**
   * Search users based on query params
   */
  async searchUsers(queryParams) {
    return await userRepository.findByQuery(queryParams);
  }

  /**
   * Update a user
   */
  async updateUser(id, updates) {
    return await userRepository.updateById(id, updates);
  }

  /**
   * Delete a user
   */
  async deleteUser(id) {
    return await userRepository.deleteById(id);
  }
}

module.exports = new UserService();
