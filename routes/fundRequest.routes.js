const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const FundRequestController = require('../controllers/fundRequest.controller');

const FundRequestDeserializer = require('../deserializers/fundRequest.deserializer');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

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
  FundRequestDeserializer.createRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundRequestController.create
);

router.get(
  '/',
  authenticateToken,
  FundRequestDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundRequestController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundRequestController.getById
);

router.put(
  '/:id',
  authenticateToken,
  FundRequestDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundRequestController.update
);

router.put(
  '/:id/approve',
  authenticateToken,
  FundRequestDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundRequestController.approve
);

module.exports = router;