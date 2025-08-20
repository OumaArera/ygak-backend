const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');
const ProjectValidation = require('../deserializers/project.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');

// Routes
router.post(
  '/',
  authenticateToken,
  ProjectValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ProjectController.create
);

router.get(
  '/',
  authenticateToken,
  ProjectValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ProjectController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  ProjectController.getById
);

router.put(
  '/:id',
  authenticateToken,
  ProjectValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ProjectController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  ProjectController.delete
);

module.exports = router;
