const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const PaymentController = require('../controllers/payment.controller');

const PaymentDeserializer = require('../deserializers/payment.deserializer');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');

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


router.post(
  '/',
  authenticateToken,
  upload,
  PaymentDeserializer.createRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  PaymentController.create
);

router.get(
  '/',
  authenticateToken,
  PaymentDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  PaymentController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  PaymentController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload,
  PaymentDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  PaymentController.update
);

router.get(
  '/budget/:budgetId/summary',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  PaymentController.getBudgetSummary
);

module.exports = router;