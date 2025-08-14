const { body, query } = require('express-validator');

class MeetingDeserializer {
  /**
   * Validation rules for creating a meeting
   */
  static createRules() {
    return [
      // Title (required)
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      // Type (required, must be either "online" or "physical")
      body('type')
        .isIn(['online', 'physical'])
        .withMessage('Type must be either "online" or "physical"'),

      // Location (optional, required only for physical)
      body('location')
        .isString()
        .notEmpty()
        .withMessage('Location is required'),

      // Date & Time (required)
      body('dateTime')
        .isISO8601()
        .withMessage('DateTime must be a valid date in ISO 8601 format')
        .custom((value) => {
          if (new Date(value) < new Date()) {
            throw new Error('DateTime must be in the future');
          }
          return true;
        }),

      // Agenda (optional, must be an array of strings)
      body('agenda')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Agenda must be an array')
        .custom((agenda) => {
          if (!agenda.every(item => typeof item === 'string')) {
            throw new Error('All agenda items must be strings');
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for updating a meeting
   */
  static updateRules() {
    return [
      body('title')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Title cannot be empty'),

      body('type')
        .optional()
        .isIn(['online', 'physical'])
        .withMessage('Type must be either "online" or "physical"'),

      body('location')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Location cannot be empty'),,

      body('dateTime')
        .optional()
        .isISO8601()
        .withMessage('DateTime must be a valid date in ISO 8601 format')
        .custom((value) => {
          if (new Date(value) < new Date()) {
            throw new Error('DateTime must be in the future');
          }
          return true;
        }),

      body('agenda')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Agenda must be an array')
        .custom((agenda) => {
          if (!agenda.every(item => typeof item === 'string')) {
            throw new Error('All agenda items must be strings');
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for querying meetings
   */
  static queryRules() {
    return [
      query('title').optional().isString(),
      query('type').optional().isIn(['online', 'physical']),
      query('location').optional().isString(),
      query('dateTime').optional().isISO8601(),
      query('agenda').optional().isString(),

      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100'),
    ];
  }
}

module.exports = MeetingDeserializer;
