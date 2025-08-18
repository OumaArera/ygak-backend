const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const ProjectController = require('../controllers/project.controller');
const ProjectValidation = require('../deserializers/project.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Enhanced validation error handler (same as Report routes)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

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
