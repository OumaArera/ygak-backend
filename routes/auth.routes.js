const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const AuthController = require('../controllers/auth.controller');
const AuthValidation = require('../dtos/auth.dto');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Helper for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Login
router.post(
  '/login',
  AuthValidation.loginRules(),
  validate,
  AuthController.login
);

// Change password (logged in users only)
router.patch(
  '/change-password',
  authenticateToken,
  AuthValidation.changePasswordRules(),
  validate,
  AuthController.changePassword
);

// Block a user (SUPERUSER only)
router.patch(
  '/:id/block',
  authenticateToken,
  // allowRoles('SUPERUSER'),
  AuthController.blockUser
);

// Unblock a user (SUPERUSER only)
router.patch(
  '/:id/unblock',
  authenticateToken,
  // allowRoles('SUPERUSER'),
  AuthController.unblockUser
);

// Optional logout route
router.post(
  '/logout',
  authenticateToken,
  AuthController.logout
);

// Optional token verification route
router.post(
  '/verify-token',
  validate,
  AuthController.verifyToken
);

module.exports = router;
