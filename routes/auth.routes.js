const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const AuthValidation = require('../deserializers/auth.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');

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
