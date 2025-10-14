const express = require('express');
const router = express.Router();
const UpcomingProjectController = require('../controllers/upcomingProject.controller');
const UpcomingProjectValidation = require('../deserializers/upcomingProject.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware'); 
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware'); 
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware'); 
const validate = require('../middlewares/validate.middleware'); 


router.post(
  '/',
  authenticateToken,
  upload, 
  UpcomingProjectValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'), 
  UpcomingProjectController.create
);

router.get(
  '/',
  UpcomingProjectValidation.queryRules(),
  validate,
  UpcomingProjectController.search
);

router.get(
  '/:id',
  UpcomingProjectController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload,
  UpcomingProjectValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  UpcomingProjectController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  UpcomingProjectController.delete
);

module.exports = router;