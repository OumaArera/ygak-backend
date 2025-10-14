const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/blog.controller');
const BlogValidation = require('../deserializers/blog.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const upload = require('../middlewares/uploadFiles.memoryStorage.middleware');
const validate = require('../middlewares/validate.middleware');
const parseJSONFields = require('../middlewares/jsonParse.middleware');

router.post(
  '/',
  authenticateToken,
  upload,
  parseJSONFields(['paragraphs']),
  BlogValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'), 
  BlogController.create
);

router.get(
  '/',
  BlogValidation.queryRules(),
  validate,
  BlogController.search
);

router.get(
  '/:id',
  BlogController.getById
);

router.put(
  '/:id',
  authenticateToken,
  upload,
  BlogValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  BlogController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'), 
  BlogController.delete
);

module.exports = router;
