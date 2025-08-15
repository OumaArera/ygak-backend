const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const FundAllocationController = require('../controllers/fundAllocation.controller');
const FundAllocationDeserializer = require('../deserializers/fundAllocation.deserializer');

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

// Create fund allocation
router.post(
  '/',
  authenticateToken,
  FundAllocationDeserializer.createRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.create
);

// Get all fund allocations with search/filter capability
router.get(
  '/',
  authenticateToken,
  FundAllocationDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.search
);

// Get fund allocation summary/statistics
router.get(
  '/summary',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.getSummary
);

// Get fund allocations by budget ID
router.get(
  '/budget/:budgetId',
  authenticateToken,
  FundAllocationDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.getByBudget
);

// Get fund allocations by fund request ID
router.get(
  '/fund-request/:fundRequestId',
  authenticateToken,
  FundAllocationDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.getByFundRequest
);

// Get fund allocation by ID
router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  FundAllocationController.getById
);

// Update fund allocation
router.put(
  '/:id',
  authenticateToken,
  FundAllocationDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundAllocationController.update
);

// Update fund allocation status
router.put(
  '/:id/status',
  authenticateToken,
  FundAllocationDeserializer.statusUpdateRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundAllocationController.updateStatus
);

// Reallocate funds to different budget
router.put(
  '/:id/reallocate',
  authenticateToken,
  FundAllocationDeserializer.reallocationRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundAllocationController.reallocate
);

// Delete fund allocation (only if not utilized)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FundAllocationController.delete
);

module.exports = router;