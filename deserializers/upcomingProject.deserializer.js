const { body, query } = require('express-validator');

class UpcomingProjectDeserializer {
  /**
   * Validation rules for creating an upcoming project
   */
  static createRules() {
    return [
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('theme')
        .optional()
        .isString()
        .withMessage('Theme must be a string'),
        
      body('description')
        .isString()
        .notEmpty()
        .withMessage('Description is required'),
        
      body('image')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.image && req.files.image.length > 0) {
            const file = req.files.image[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid Image file type. Only JPEG, JPG, PNG, and WEBP are allowed.');
            }
          }
          return true;
        }),
      body('date')
        .isISO8601({ strict: true })
        .toDate()
        .withMessage('Date must be a valid date (YYYY-MM-DD)'),
    ];
  }

  /**
   * Validation rules for updating an upcoming project
   */
  static updateRules() {
    return [
      body('title').optional().isString().notEmpty(),
      body('theme').optional().isString(),
      body('description').optional().isString().notEmpty(),
      body('image')
        .optional()
        .custom((value, { req }) => {
          // Check for file existence in req.files under the 'image' key
          if (req.files && req.files.image && req.files.image.length > 0) {
            const file = req.files.image[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid Image file type. Only JPEG, JPG, PNG, and WEBP are allowed.');
            }
          }
          return true;
        }),
      body('date')
        .optional()
        .isISO8601({ strict: true })
        .toDate()
        .withMessage('Date must be a valid date (YYYY-MM-DD)'),
    ];
  }

  /**
   * Validation rules for querying upcoming projects
   */
  static queryRules() {
    return [
      query('title').optional().isString(),
      query('theme').optional().isString(),
      query('description').optional().isString(),
      body('date')
        .optional()
        .isISO8601({ strict: true })
        .toDate()
        .withMessage('Date must be a valid date (YYYY-MM-DD)'),
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

module.exports = UpcomingProjectDeserializer;