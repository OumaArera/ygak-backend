const express = require('express');
const router = express.Router();
const FundReallocationController = require('../controllers/fundReallocation.controller');
const FundReallocationDeserializer = require('../deserializers/fundReallocation.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');

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