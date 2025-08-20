const express = require('express');
const router = express.Router();

const BudgetController = require('../controllers/budget.controller');
const BudgetValidation = require('../deserializers/budget.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');
const parseJSONFields = require('../middlewares/jsonParse.middleware');
const validate = require('../middlewares/validate.middleware');


// Routes
router.post(
  '/',
  authenticateToken,
  upload,
  parseJSONFields(['recipient', 'particulars']),
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
  parseJSONFields(['recipient', 'particulars']),
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