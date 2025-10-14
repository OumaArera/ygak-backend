const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory.controller');
const InventoryValidation = require('../deserializers/inventory.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');


// Routes for Inventory
router.post(
  '/',
  authenticateToken,
  InventoryValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  InventoryController.create
);

router.get(
  '/',
  authenticateToken,
  InventoryValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  InventoryController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  InventoryController.getById
);

router.put(
  '/:id',
  authenticateToken,
  InventoryValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  InventoryController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  InventoryController.delete
);

module.exports = router;
