const express = require('express');
const router = express.Router();
const ResourceLibraryController = require('../controllers/resourceLibrary.controller');
const ResourceValidation = require('../deserializers/resourceLibrary.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware'); 
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware'); 
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware'); // Multer instance
const validate = require('../middlewares/validate.middleware'); 

router.post(
  '/',
  authenticateToken,
  upload, 
  ResourceValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'), 
  ResourceLibraryController.create
);

router.get(
  '/',
  ResourceValidation.queryRules(),
  validate,
  ResourceLibraryController.search
);

router.get(
  '/:id',
  ResourceLibraryController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload, 
  ResourceValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  ResourceLibraryController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  ResourceLibraryController.delete
);

module.exports = router;