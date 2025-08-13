const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const ReportController = require('../controllers/report.controller');
const ReportValidation = require('../dtos/report.dto');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const fileUploadMiddleware = require('../middlewares/fileUpload.diskStorage.middleware');

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

// Routes
router.post(
  '/',
  authenticateToken,
  fileUploadMiddleware([{ name: 'content', maxCount: 1 }]),
  ReportValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ReportController.create
);

router.get(
  '/',
  authenticateToken,
  ReportValidation.queryRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ReportController.search
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  ReportController.getById
);

router.put(
  '/:id',
  authenticateToken,
  fileUploadMiddleware([{ name: 'content', maxCount: 1 }]),
  ReportValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ReportController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  ReportController.delete
);

module.exports = router;
