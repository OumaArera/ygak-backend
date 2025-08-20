const express = require('express');
const router = express.Router();
const GeneralLedgerController = require('../controllers/generalLedger.controller');
const GeneralLedgerDeserializer = require('../deserializers/generalLedger.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');


router.post(
  '/',
  authenticateToken,
  GeneralLedgerDeserializer.createRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  GeneralLedgerController.create
);

router.get(
  '/',
  authenticateToken,
  GeneralLedgerDeserializer.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  GeneralLedgerController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
  GeneralLedgerController.getById
);

router.get(
  '/:id/balance',
  authenticateToken,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  GeneralLedgerController.getBalance
);

router.put(
  '/:id',
  authenticateToken,
  GeneralLedgerDeserializer.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardTreasurerAccess'),
  GeneralLedgerController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  GeneralLedgerController.delete
);

module.exports = router;