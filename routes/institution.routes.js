const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const InstitutionController = require('../controllers/institution.controller');
const InstitutionValidation = require('../dtos/institution.dto');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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
  authenticateToken, 
  authorizeRolesFromMapping('AllUsers'),
  InstitutionController.search
);
router.get(
  '/:id', 
  authenticateToken, 
  authorizeRolesFromMapping('AllUsers'),
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
