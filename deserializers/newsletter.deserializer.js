const { body, query } = require('express-validator');

class NewsletterDeserializer {
  static createRules() {
    return [
      body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    ];
  }

  static updateRules() {
    return [
      body('isActive')
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    ];
  }

  static queryRules() {
    return [
      query('isActive').optional().isBoolean(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
    ];
  }
}

module.exports = NewsletterDeserializer;
