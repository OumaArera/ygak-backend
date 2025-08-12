const express = require('express');
const router = express.Router();
const ActivityTrackerController = require('../controllers/activityTracker.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const ActivityTrackerDTO = require('../dtos/activityTracker.dto');

// Only authorized roles should view logs
router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  ActivityTrackerDTO.filterValidation,
  ActivityTrackerController.getActivities
);

module.exports = router;
