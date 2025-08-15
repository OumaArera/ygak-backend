const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const FundReallocationController = require('../controllers/fundReallocation.controller');

const FundReallocationDeserializer = require('../deserializers/fundReallocation.deserializer');

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
  FundReallocationDeserializer.createRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundReallocationController.create
);

router.get(
  '/',
  authenticateToken,
  FundReallocationDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundReallocationController.search
);

router.put(
  '/:id/approve',
  authenticateToken,
  FundReallocationDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundReallocationController.approve
);

module.exports = router;