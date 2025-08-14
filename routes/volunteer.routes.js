const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const VolunteerController = require('../controllers/volunteer.controller');
const VolunteerValidation = require('../deserializers/volunteer.deserializer');
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
  VolunteerValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  VolunteerController.create
);

router.get(
  '/',
  authenticateToken,
  VolunteerValidation.queryRules(),
  authorizeRolesFromMapping('AllBoardMembers'),
  VolunteerController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  VolunteerController.getById
);

router.put(
  '/:id',
  authenticateToken,
  VolunteerValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  VolunteerController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  VolunteerController.delete
);

module.exports = router;
