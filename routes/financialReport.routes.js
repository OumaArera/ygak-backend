const express = require('express');
const router = express.Router();
const FinancialReportsController = require('../controllers/financialReport.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

router.get(
  '/gl/:glId/statement',
  authenticateToken,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FinancialReportsController.getGLStatement
);

router.get(
  '/budget/:budgetId/summary',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  FinancialReportsController.getBudgetFinancialSummary
);

router.get(
  '/allocations/summary',
  authenticateToken,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  FinancialReportsController.getAllocationsSummary
);

router.get(
  '/dashboard',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  FinancialReportsController.getDashboard
);

module.exports = router;

