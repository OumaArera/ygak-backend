const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const NewsletterController = require('../controllers/newsletter.controller');
const NewsletterValidation = require('../deserializers/newsletter.deserializer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRolesFromMapping } = require('../middlewares/roles.middleware');
const { roleGroups } = require('../utils/rolePermissions');

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

router.post(
  '/',
  authenticateToken,
  authorizeRolesFromMapping(['Board Member'], [...roleGroups.BoardMemberGroup]),
  NewsletterValidation.create,
  validate,
  NewsletterController.create
);

router.get(
  '/',
  authenticateToken,
  NewsletterController.getAll
);

router.get(
  '/:id',
  authenticateToken,
  NewsletterController.getById
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping(['Board Member'], [...roleGroups.BoardMemberGroup]),
  NewsletterValidation.update,
  validate,
  NewsletterController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRolesFromMapping(['Board Member'], [...roleGroups.BoardMemberGroup]),
  NewsletterController.delete
);

module.exports = {
  router,
  basePath: '/newsletters'
};
