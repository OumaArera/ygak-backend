const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const UserController = require('../controllers/user.controller');
const UserValidation = require('../dtos/user.dto');
const { authenticateToken } = require('../middlewares/auth.middleware');
// const { allowRoles } = require('../middlewares/role.middleware');
const { conditionalSuperuserAccess } = require('../middlewares/conditionalSuperuser.middleware');

// Helper for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create user (Superuser or special conditional)
router.post(
  '/',
  conditionalSuperuserAccess,
  UserValidation.createRules(),
  validate,
  UserController.createUser
);

// Get all users (MANAGEMENT only)
router.get(
  '/',
  authenticateToken,
  // allowRoles('MANAGEMENT'),
  UserController.searchUsers
);

// Get user by ID (ALL_USERS)
router.get(
  '/:id',
  authenticateToken,
  // allowRoles('ALL_USERS'),
  UserController.getUserById
);

// Update user (self-only)
router.put(
  '/:id',
  authenticateToken,
  (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  },
  UserValidation.updateRules(),
  validate,
  UserController.updateUser
);

// Delete user (optional — add if you need)
router.delete(
  '/:id',
  authenticateToken,
  conditionalSuperuserAccess,
  UserController.deleteUser
);

module.exports = router;
