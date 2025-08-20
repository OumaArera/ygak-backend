const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const PaymentDeserializer = require('../deserializers/payment.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');
const validate = require('../middlewares/validate.middleware');


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