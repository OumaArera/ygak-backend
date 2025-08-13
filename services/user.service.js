const userRepository = require('../repositories/user.repository');
const { generateRandomPassword } = require('../utils/generatePassword');
const { generateAccountCredentialsEmail } = require('../utils/password.html');
const { sendEmail } = require('../utils/email.util');

class UserService {
  /**
   * Create a new user
   */
  async createUser(userData, userContext) {
    const password = generateRandomPassword();
    console.log("Password: ", password);
    const emailHtml = generateAccountCredentialsEmail(
      userData.firstName,
      userData.email,
      password
    );
    // Send the welcome email
    await sendEmail(
      userData.email,
      `${userData.firstName} ${userData.lastName || ''}`.trim(),
      "Account Creation!",
      emailHtml,
    );

    return await userRepository.create({
      ...userData,
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
