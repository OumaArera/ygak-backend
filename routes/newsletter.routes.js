const express = require('express');
const router = express.Router();
const NewsletterController = require('../controllers/newsletter.controller');
const NewsletterValidation = require('../deserializers/newsletter.deserializer');
const validate = require('../middlewares/validate.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');

router.post(
  '/subscribe',
  NewsletterValidation.createRules(),
  validate,
  NewsletterController.subscribe
);

router.post(
  '/unsubscribe',
  NewsletterValidation.createRules(),
  validate,
  NewsletterController.unsubscribe
);

router.get(
  '/',
  authenticateToken,
  authorizeRolesFromMapping('AllUsers'),
  NewsletterValidation.queryRules(),
  validate,
  NewsletterController.list
);

module.exports = router;
