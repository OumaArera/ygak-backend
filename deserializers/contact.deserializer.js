const { body, query } = require('express-validator');

class ContactDeserializer {
  static submitRules() {
    return [
      body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
      body('lastName').isString().trim().notEmpty().withMessage('Last name is required'),
      body('email').isEmail().withMessage('A valid email address is required'),
      body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in valid international format'),
      body('company').optional().isString().trim(),
      body('subject').isString().trim().notEmpty().withMessage('Subject is required'),
      body('message').isString().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
      body('preferredContact').isIn(['Email', 'Phone', 'WhatsApp']).withMessage('Preferred contact must be Email or Phone'),
      body('heardFrom').optional().isString().trim(),
      body('bestTime').optional().isString().trim(),
    ];
  }

  static queryRules() {
    return [
      query('id').optional().isUUID().withMessage('ID must be a valid UUID'),
      query('email').optional().isEmail().withMessage('Email filter must be a valid email'),
      query('subject').optional().isString().withMessage('Subject filter must be a string'),
      query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    ];
  }

  static updateRules() {
    return [
      // All fields are optional because you might only update one field (e.g., status)
      body('firstName').optional().isString().trim(),
      body('lastName').optional().isString().trim(),
      body('email').optional().isEmail().withMessage('Email must be valid'),
      body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in valid international format'),
      body('company').optional().isString().trim(),
      body('subject').optional().isString().trim(),
      body('message').optional().isString().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
      body('preferredContact').optional().isIn(['Email', 'Phone', 'WhatsApp']).withMessage('Preferred contact must be Email or Phone'),
      body('heardFrom').optional().isString().trim(),
      body('bestTime').optional().isString().trim(),
      body('status').optional().isIn(['New', 'Processing', 'Closed']).withMessage('Invalid status value'),
    ];
  }
}

module.exports = ContactDeserializer;