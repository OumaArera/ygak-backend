const express = require('express');
const router = express.Router();
const EventMediaController = require('../controllers/eventMedia.controller');
const EventMediaValidation = require('../deserializers/eventMedia.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');

// Routes for Event Media
router.post(
  '/',
  authenticateToken,
  upload,
  EventMediaValidation.createRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  EventMediaController.create
);

router.get(
  '/',
  EventMediaValidation.queryRules(),
  validate,
  EventMediaController.search
);

router.get(
  '/:id',
  authenticateToken,
  EventMediaController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload,
  EventMediaValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  EventMediaController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  EventMediaController.delete
);

module.exports = router;
