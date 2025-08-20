const { body, query } = require('express-validator');

class EventMediaDeserializer {
  /**
   * Validation rules for creating EventMedia
   */
  static createRules() {
    return [
      body('eventId')
        .isUUID()
        .withMessage('eventId must be a valid UUID'),

      body('images').custom((value, { req }) => {
        if (!req.files || !req.files.images || req.files.images.length === 0) {
          throw new Error('At least one image is required');
        }

        if (req.files.images.length > 20) {
          throw new Error('A maximum of 20 images are allowed');
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        for (const file of req.files.images) {
          if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(`Invalid file type: ${file.originalname}`);
          }
        }

        return true;
      }),

      body('description')
        .optional()
        .isString()
        .withMessage('description must be a string'),
    ];
  }

  /**
   * Validation rules for updating EventMedia
   */
  static updateRules() {
    return [
      body('eventId')
        .optional()
        .isUUID()
        .withMessage('eventId must be a valid UUID'),

      body('images')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.images && req.files.images.length > 0) {
            if (req.files.images.length > 20) {
              throw new Error('A maximum of 20 images are allowed');
            }

            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            for (const file of req.files.images) {
              if (!allowedTypes.includes(file.mimetype)) {
                throw new Error(`Invalid file type: ${file.originalname}`);
              }
            }
          }
          return true;
        }),

      body('description')
        .optional()
        .isString()
        .withMessage('description must be a string'),
    ];
  }

  /**
   * Validation rules for querying EventMedia
   */
  static queryRules() {
    return [
      query('eventId')
        .optional()
        .isUUID()
        .withMessage('eventId must be a valid UUID'),

      query('description')
        .optional()
        .isString()
        .withMessage('description must be a string'),

      // Pagination
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

module.exports = EventMediaDeserializer;
