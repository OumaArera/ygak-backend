const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');
const userRepository = require('../repositories/user.repository');
const User = require('../models/user.model');
const TokenService = require('../services/token.service');

class AuthService {
  /**
   * Authenticate a user and return JWT token
   */
  async login(email, password) {
    const user = await authRepository.findUserForLogin(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is blocked. Contact administrator.');
    }

    // Validate password using model method
    const isMatch = await User.validatePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Create JWT with all requested fields
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      regNumber: user.regNumber,
      designation: user.designation,
      role: user.role,
      isSuperUser: user.isSuperUser,
      isStaff: user.isStaff,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    await TokenService.invalidateAllUserTokens(user.id);
    await TokenService.saveToken(user.id, token, new Date(Date.now() + 8 * 60 * 60 * 1000));
    console.log("Token After: ", token);
    const encryptedToken = TokenService.encrypt(token);

    return encryptedToken;
  }

  /**
   * Logout (middleware/session-based approach)
   * Blacklist JWT token
   */
  async logout(req, res) {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          throw new Error('Logout failed');
        }
      });
    }
    return { message: 'Logged out successfully' };
  }

  /**
   * Block a user (set isActive to false)
   */
  async blockUser(userId) {
    const updatedUser = await userRepository.updateById(userId, { isActive: false });
    return updatedUser;
  }

  /**
   * Unblock a user (set isActive to true)
   */
  async unblockUser(userId) {
    const updatedUser = await userRepository.updateById(userId, { isActive: true });
    return updatedUser;
  }

  /**
   * Validate JWT and return user payload
   */
  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(id, oldPassword, newPassword) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate old password
    const isMatch = await User.validatePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash new password
    // const hashedPassword = await User.hashPassword(newPassword);

    // Update password in database
    await userRepository.updateById(id, { password: newPassword });

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
