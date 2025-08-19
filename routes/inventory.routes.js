const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const InventoryController = require('../controllers/inventory.controller');
const InventoryValidation = require('../deserializers/inventory.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Validation error handler
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

// Routes for Inventory
router.post(
  '/',
  authenticateToken,
  InventoryValidation.createRules(),
  validate,
  authorizeRolesFromMapping('BoardSecretaryAccess'),
  InventoryController.create
);

router.get(
  '/',
  authenticateToken,
  InventoryValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllBoardMembers'),
  InventoryController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllBoardMembers'),
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
