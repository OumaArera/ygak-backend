const express = require('express');
const router = express.Router();
const VolunteerController = require('../controllers/volunteer.controller');
const VolunteerValidation = require('../deserializers/volunteer.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
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
