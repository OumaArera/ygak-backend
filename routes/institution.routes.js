const express = require('express');
const router = express.Router();
const InstitutionController = require('../controllers/institution.controller');
const InstitutionValidation = require('../deserializers/institution.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');


// Routes
router.post(
  '/',
  authenticateToken,
  InstitutionValidation.createRules(),
  validate,
  authorizeRolesFromMapping('AllUsers'),
  InstitutionController.create
);

router.get(
  '/', 
  InstitutionController.search
);
router.get(
  '/:id', 
  InstitutionController.getById
);

router.put(
  '/:id',
  authenticateToken,
  InstitutionValidation.updateRules(),
  validate,
  authorizeRolesFromMapping('ITSuperuserAccess'),
  InstitutionController.update
);

router.delete(
  '/:id', 
  authenticateToken, 
  authorizeRolesFromMapping('ITSuperuserAccess'),
  InstitutionController.delete
);

module.exports = router;
