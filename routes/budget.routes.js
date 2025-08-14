const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const BudgetController = require('../controllers/budget.controller');
const BudgetValidation = require('../deserializers/budget.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');
const parseJSONFields = require('../middlewares/jsonParse.middleware');

// Enhanced validation error handler
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
  upload, // Use the improved upload middleware
  parseJSONFields(['recipient', 'particulars']), // Parse JSON fields
  BudgetValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  BudgetController.create
);

router.get(
  '/',
  authenticateToken,
  BudgetValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  BudgetController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  BudgetController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload, 
  parseJSONFields(['recipient', 'particulars']), // Parse JSON fields
  BudgetValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  BudgetController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  BudgetController.delete
);

module.exports = router;