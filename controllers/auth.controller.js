const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * User login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = req.user ? req.user : {}
      const token = await AuthService.login(email, password, user);
      res.status(200).json({success: true, data: token });
    } catch (err) {
      res.status(400).json({success: false, error:err.message});
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
  async blockUser(req, res) {
    try {
      const updatedUser = await AuthService.blockUser(req.params.userId, req.user);
      res.status(200).json({success: true, data: updatedUser});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Unblock a user
   */
  async unblockUser(req, res) {
    try {
      const updatedUser = await AuthService.unblockUser(req.params.userId, req.user);
      res.status(200).json({success: true, data: updatedUser});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Verify token
   */
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const payload = await AuthService.verifyToken(token);
      res.status(200).json({success: true, data: payload});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res) {
    try {
      const {email, oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(email, oldPassword, newPassword, req.user);
      res.status(200).json({success: true, data: result});
    } catch (err) {
      res.status(400).json({success: false, error:err.message});
    }
  }
}

module.exports = new AuthController();
