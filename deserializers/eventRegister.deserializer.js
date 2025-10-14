const { body, query } = require('express-validator');

class EventRegisterDeserializer {
  static createRules() {
    return [
      body('eventId').isUUID().withMessage('Valid eventId is required'),
      body('fullName').isString().notEmpty().withMessage('Full name is required'),
      body('email').isEmail().withMessage('A valid email address is required'),
      body('phoneNumber')
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Phone number must be in valid international format, e.g., +254712345678'),
    ];
  }

  static queryRules() {
    return [
      query('eventId').optional().isUUID(),
      query('email').optional().isEmail(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
    ];
  }
}

module.exports = EventRegisterDeserializer;
