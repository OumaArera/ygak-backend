// routes/task.routes.js

const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const TaskController = require('../controllers/task.controller');
const TaskValidation = require('../deserializers/task.deserializer');
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
  TaskValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  TaskController.create
);

router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  TaskController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  TaskController.getById
);

router.put(
  '/:id',
  authenticateToken,
  TaskValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  TaskController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  TaskController.delete
);

module.exports = router;
