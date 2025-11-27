const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contact.controller');
const ContactValidation = require('../deserializers/contact.deserializer');
const validate = require('../middlewares/validate.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

// --- C: Create (Public Route) ---
router.post(
  '/',
  ContactValidation.submitRules(),
  validate,
  ContactController.submit
);

// --- R: Read All (Protected & Authorized) ---
router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'), 
  ContactValidation.queryRules(),
  validate,
  ContactController.getAll
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  ContactController.getById
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('ITSuperuserAccess'), 
  ContactController.delete
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'), 
  ContactValidation.updateRules(),
  validate,
  ContactController.update
);

module.exports = router;