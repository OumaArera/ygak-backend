const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const UserValidation = require('../deserializers/user.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const { conditionalSuperuserAccess } = require('../middlewares/conditionalSuperuser.middleware');
const validate = require('../middlewares/validate.middleware');


router.post(
  '/',
  conditionalSuperuserAccess,
  UserValidation.createRules(),
  UserController.createUser
);

router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  UserController.searchUsers
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  UserController.getUserById
);

router.put(
  '/:id',
  authenticateToken,
  UserValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  UserController.updateUser
);

router.delete(
  '/:id',
  authenticateToken,
  conditionalSuperuserAccess,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  UserController.deleteUser
);

module.exports = router;
