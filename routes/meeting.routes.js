const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const MeetingController = require('../controllers/meeting.controller');
const MeetingValidation = require('../deserializers/meeting.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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
