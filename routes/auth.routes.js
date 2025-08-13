const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const AuthController = require('../controllers/auth.controller');
const AuthValidation = require('../dtos/auth.dto');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Helper for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/login',
  AuthValidation.loginRules(),
  validate,
  AuthController.login
);

router.patch(
  '/change-password',
  authenticateToken,
  AuthValidation.changePasswordRules(),
  validate,
  AuthController.changePassword
);

router.patch(
  '/:id/block',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  AuthController.blockUser
);

router.patch(
  '/:id/unblock',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  AuthController.unblockUser
);


router.post(
  '/logout',
  authenticateToken,
  AuthController.logout
);


router.post(
  '/verify-token',
  validate,
  AuthController.verifyToken
);

module.exports = router;
