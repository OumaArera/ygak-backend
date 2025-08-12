const UserService = require('../services/user.service');

class UserController {
  /**
   * Create a new user
   */
  async createUser(req, res, next) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Search/filter users
   */
  async searchUsers(req, res, next) {
    try {
      const users = await UserService.searchUsers(req.query);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a user
   */
  async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(req, res, next) {
    try {
      const deleted = await UserService.deleteUser(req.params.id);
      res.json(deleted);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
