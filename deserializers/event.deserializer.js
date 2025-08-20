const { body, query } = require('express-validator');

class EventDeserializer {
  /**
   * Validation rules for creating an event
   */
  static createRules() {
    return [
      // Core fields
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('description')
        .isString()
        .notEmpty()
        .withMessage('Description must be a string'),

      body('county')
        .isString()
        .notEmpty()
        .withMessage('County is required'),

      body('subCounty')
        .isString()
        .notEmpty()
        .withMessage('Sub-county must be a string'),

      // Coordinates
      body('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a valid coordinate between -90 and 90'),

      body('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a valid coordinate between -180 and 180'),

      // Approval flag
      body('isApproved')
        .optional()
        .isBoolean()
        .withMessage('isApproved must be a boolean'),

      // Event date
      body('date')
        .isISO8601({ strict: true })
        .toDate()
        .withMessage('Date must be a valid date (YYYY-MM-DD)'),

      body('flyer')
        .custom((value, { req }) => {
          if (req.files && req.files.receipt && req.files.receipt.length > 0) {
            const file = req.files.receipt[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid Flyer file type');
            }
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for updating an event
   */
  static updateRules() {
    return [
      body('title').optional().isString().notEmpty(),
      body('description').optional().isString().notEmpty(),
      body('county').optional().isString().notEmpty(),
      body('subCounty').optional().isString().notEmpty(),
      body('latitude').optional().isFloat({ min: -90, max: 90 }),
      body('longitude').optional().isFloat({ min: -180, max: 180 }),
      body('isApproved').optional().isBoolean(),
      body('date').optional().isISO8601({ strict: true }).toDate(),
      body('flyer')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.receipt && req.files.receipt.length > 0) {
            const file = req.files.receipt[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid Flyer file type');
            }
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for querying events
   */
  static queryRules() {
    return [
      query('title').optional().isString(),
      query('description').optional().isString(),
      query('county').optional().isString(),
      query('subCounty').optional().isString(),
      query('latitude').optional().isFloat({ min: -90, max: 90 }),
      query('longitude').optional().isFloat({ min: -180, max: 180 }),
      query('isApproved').optional().isBoolean(),
      query('date').optional().isISO8601({ strict: true }).toDate(),
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

module.exports = EventDeserializer;
