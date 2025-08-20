const express = require('express');
const router = express.Router();

const MeetingController = require('../controllers/meeting.controller');
const MeetingValidation = require('../deserializers/meeting.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');

// Routes
router.post(
  '/',
  authenticateToken,
  MeetingValidation.createRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  MeetingController.create
);

router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  MeetingController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  MeetingController.getById
);

router.put(
  '/:id',
  authenticateToken,
  MeetingValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  MeetingController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  MeetingController.delete
);

module.exports = router;
