const UserService = require('../services/user.service');
const { handleAllErrors } = require('../utils/sequelizeErrorHandler.util');

class UserController {
  /**
   * Create a new user
   */
  async createUser(req, res) {
    try {
      const newUser = await UserService.createUser(req.body, req.user);
      res.status(201).json({success: true, data:newUser});
    } catch (err) {

      console.error('Error in UserController.createUser:', err);
      
      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }

      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id, req.user);
      if (!user) {
        return res.status(404).json({success: false, error: 'User not found' });
      }
      res.status(200).json({success: true, data:user});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Search/filter users
   */
  async searchUsers(req, res) {
    try {
      const users = await UserService.searchUsers(req.query, req.user);
      res.status(200).json({success: true, data:users});
    } catch (err) {
      res.status(500).json({success: false, error:err.message});
    }
  }

  /**
   * Update a user
   */
  async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body, req.user);
      res.status(200).json({success: true, data: updatedUser});
    } catch (err) {
      console.error('Error in UserController.updateUser:', err);

      const sequelizeErrors = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError', 'SequelizeValidationError'];
      if (sequelizeErrors.includes(err.name)) {
        const errors = handleAllErrors(err);
        return res.status(400).json({ success: false, errors });
      }
      res.status(500).json({success: false, error: err.message});
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(req, res) {
    try {
      const deleted = await UserService.deleteUser(req.params.id, req.user);
      res.status(204).json({success: true, data: deleted});
    } catch (err) {
      res.status(500).json({success: false, error: err.message});
    }
  }
}

module.exports = new UserController();
