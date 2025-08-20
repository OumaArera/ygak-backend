const express = require('express');
const router = express.Router();
const FundRequestController = require('../controllers/fundRequest.controller');
const FundRequestDeserializer = require('../deserializers/fundRequest.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');


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