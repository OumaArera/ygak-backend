const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event.controller');
const EventValidation = require('../deserializers/event.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/',
  authenticateToken,
  upload,
  EventValidation.createRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  EventController.create
);

router.get(
  '/',
  EventValidation.queryRules(),
  validate,
  EventController.search
);

router.get(
  '/:id',
  authenticateToken,
  EventController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload,
  EventValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  EventController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  EventController.delete
);

module.exports = router;
