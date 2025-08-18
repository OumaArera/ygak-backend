const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const AssetRequestController = require('../controllers/assetRequest.controller');
const AssetRequestValidation = require('../deserializers/assetRequest.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Validation error handler to centralize response logic
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

// Routes for AssetRequest
router.post(
  '/',
  authenticateToken,
  AssetRequestValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  AssetRequestController.create
);

router.get(
  '/',
  authenticateToken,
  AssetRequestValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  AssetRequestController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  AssetRequestController.getById
);

router.put(
  '/:id',
  authenticateToken,
  AssetRequestValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  AssetRequestController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  AssetRequestController.delete
);

module.exports = router;
