const { body, query } = require('express-validator');

class ResourceLibraryDeserializer {
  /**
   * Validation rules for creating a resource
   */
  static createRules() {
    return [
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
        
      body('category')
        .optional()
        .isString(),
        
      body('author')
        .optional()
        .isString(),
        
      body('date')
        .isISO8601({ strict: true })
        .toDate()
        .withMessage('Date must be a valid date (YYYY-MM-DD)'),
        
      body('file')
        .custom((value, { req }) => {
          if (!req.files || !req.files.file || req.files.file.length === 0) {
            throw new Error('File upload is required for the resource.'); 
          }
          
          const file = req.files.file[0];
          const allowedTypes = ['application/pdf'];
          if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only PDF is allowed.');
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for updating a resource
   */
  static updateRules() {
    return [
      body('title').optional().isString().notEmpty(),
      body('description').optional().isString(),
      body('category').optional().isString(),
      body('author').optional().isString(),
      body('date').optional().isISO8601({ strict: true }).toDate(),
      body('file')
        .optional()
        .custom((value, { req }) => {
          // Check for file existence in req.files under the 'file' key
          if (req.files && req.files.file && req.files.file.length > 0) {
            const file = req.files.file[0];
            const allowedTypes = ['application/pdf'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid file type. Only PDF is allowed.');
            }
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for querying resources
   */
  static queryRules() {
    return [
      query('title').optional().isString(),
      query('category').optional().isString(),
      query('author').optional().isString(),
      query('date')
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

module.exports = ResourceLibraryDeserializer;