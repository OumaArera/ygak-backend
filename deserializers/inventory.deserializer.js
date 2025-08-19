const { body, query } = require('express-validator');

class InventoryDeserializer {
  /**
   * Validation rules for creating an inventory item
   */
  static createRules() {
    return [
      // Core fields
      body('name')
        .isString()
        .notEmpty()
        .withMessage('Name is required'),

      body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

      body('tag')
        .optional()
        .isString()
        .withMessage('Tag must be a string'),

      body('serialNumber')
        .optional()
        .isString()
        .withMessage('Serial number must be a string'),

      body('acquisitionDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Acquisition date must be a valid date'),

      body('value')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Value must be a positive number'),

      body('status')
        .optional()
        .isIn(['available', 'in_use', 'under_repair', 'retired'])
        .withMessage('Invalid status value'),

      body('lastMaintenanceDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Last maintenance date must be a valid date'),

      // Association
      body('currentUserId')
        .optional()
        .isUUID()
        .withMessage('Current User ID must be a valid UUID'),
    ];
  }

  /**
   * Validation rules for updating an inventory item
   */
  static updateRules() {
    return [
      body('name').optional().isString().notEmpty(),
      body('description').optional().isString(),
      body('tag').optional().isString(),
      body('serialNumber').optional().isString(),
      body('acquisitionDate').optional().isISO8601().toDate(),
      body('value').optional().isFloat({ min: 0 }),
      body('status')
        .optional()
        .isIn(['available', 'in_use', 'under_repair', 'retired'])
        .withMessage('Invalid status value'),
      body('lastMaintenanceDate').optional().isISO8601().toDate(),
      body('currentUserId').optional().isUUID(),
    ];
  }

  /**
   * Validation rules for querying inventory items
   */
  static queryRules() {
    return [
      query('name').optional().isString(),
      query('description').optional().isString(),
      query('tag').optional().isString(),
      query('serialNumber').optional().isString(),
      query('acquisitionDate').optional().isISO8601().toDate(),
      query('value').optional().isFloat({ min: 0 }),
      query('status')
        .optional()
        .isIn(['available', 'in_use', 'under_repair', 'retired'])
        .withMessage('Invalid status value'),
      query('lastMaintenanceDate').optional().isISO8601().toDate(),
      query('currentUserId').optional().isUUID(),
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

module.exports = InventoryDeserializer;
