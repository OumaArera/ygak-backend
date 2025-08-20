const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const ReportValidation = require('../deserializers/report.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const fileUploadMiddleware = require('../middlewares/fileUpload.diskStorage.middleware');
const validate = require('../middlewares/validate.middleware');

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
