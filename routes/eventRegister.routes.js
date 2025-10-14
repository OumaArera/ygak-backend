const express = require('express');
const router = express.Router();
const EventRegisterController = require('../controllers/eventRegister.controller');
const EventRegisterValidation = require('../deserializers/eventRegister.deserializer');
const validate = require('../middlewares/validate.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

router.post(
  '/',
  EventRegisterValidation.createRules(),
  validate,
  EventRegisterController.create
);

router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  EventRegisterValidation.queryRules(),
  validate,
  EventRegisterController.getAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  EventRegisterController.getById
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  EventRegisterController.delete
);

module.exports = router;
