const { body, query } = require('express-validator');

class AssetRequestDeserializer {
  /**
   * Validation rules for creating an asset request
   */
  static createRules() {
    return [
      // Associations
      body('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),

      body('requestedBy')
        .optional()
        .isUUID()
        .withMessage('Requested By (User ID) must be a valid UUID'),

      // Core fields
      body('name')
        .isString()
        .notEmpty()
        .withMessage('Name is required'),

      body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

      body('reason')
        .isString()
        .notEmpty()
        .withMessage('Reason is required'),

      // Status
      body('status')
        .optional()
        .isIn(['pending', 'approved', 'purchased', 'declined'])
        .withMessage('Invalid status value'),
    ];
  }

  /**
   * Validation rules for updating an asset request
   */
  static updateRules() {
    return [
      body('budgetId').optional().isUUID(),
      body('requestedBy').optional().isUUID(),
      body('name').optional().isString().notEmpty(),
      body('description').optional().isString(),
      body('reason').optional().isString().notEmpty(),
      body('status')
        .optional()
        .isIn(['pending', 'approved', 'purchased', 'declined'])
        .withMessage('Invalid status value'),
    ];
  }

  /**
   * Validation rules for querying asset requests
   */
  static queryRules() {
    return [
      query('budgetId').optional().isUUID(),
      query('requestedBy').optional().isUUID(),
      query('name').optional().isString(),
      query('description').optional().isString(),
      query('reason').optional().isString(),
      query('status')
        .optional()
        .isIn(['pending', 'approved', 'purchased', 'declined'])
        .withMessage('Invalid status value'),
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

module.exports = AssetRequestDeserializer;