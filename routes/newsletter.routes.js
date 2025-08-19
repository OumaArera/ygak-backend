const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const newsletterValidationRules = require('../deserializers/newsletter.deserializer');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkRoles } = require('../middlewares/roles.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { roleGroups } = require('../utils/rolePermissions.js');

router.post(
  '/',
  authenticate,
  checkRoles([roleGroups]),
  newsletterValidationRules.create,
  validate,
  newsletterController.create
);

router.get(
  '/',
  authenticate,
  newsletterController.getAll
);

router.get(
  '/:id',
  authenticate,
  newsletterController.getById
);

router.put(
  '/:id',
  authenticate,
  checkRoles([roleGroups]),
  newsletterValidationRules.update,
  validate,
  newsletterController.update
);

router.delete(
  '/:id',
  authenticate,
  checkRoles([roleGroups]),
  newsletterController.delete
);

module.exports = router;
