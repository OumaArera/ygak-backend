const { body } = require('express-validator');

const newsletterValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters long'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters long'),
    body('content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Content cannot be empty')
  ]
};

module.exports = newsletterValidationRules;
