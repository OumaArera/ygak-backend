const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * User login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout
   */
  async logout(req, res, next) {
    try {
      const result = await AuthService.logout(req, res);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Block a user
   */
  async blockUser(req, res, next) {
    try {
      const updatedUser = await AuthService.blockUser(req.params.userId);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Unblock a user
   */
  async unblockUser(req, res, next) {
    try {
      const updatedUser = await AuthService.unblockUser(req.params.userId);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify token
   */
  async verifyToken(req, res, next) {
    try {
      const { token } = req.body;
      const payload = await AuthService.verifyToken(token);
      res.json(payload);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(req.user.id, oldPassword, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
