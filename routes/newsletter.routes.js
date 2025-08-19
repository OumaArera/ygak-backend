const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const newsletterValidationRules = require('../deserializers/newsletter.deserializer');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkRoles } = require('../middlewares/roles.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES } = require('../utils/constants');

router.post(
  '/',
  authenticate,
  checkRoles([ROLES.ADMIN]),
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
  checkRoles([ROLES.ADMIN]),
  newsletterValidationRules.update,
  validate,
  newsletterController.update
);

router.delete(
  '/:id',
  authenticate,
  checkRoles([ROLES.ADMIN]),
  newsletterController.delete
);

module.exports = router;
