const { body, query } = require('express-validator');

class ProjectDeserializer {
  /**
   * Validation rules for creating a project
   */
  static createRules() {
    return [
      // Associations
      body('maker')
        .optional()
        .isUUID()
        .withMessage('Maker (User ID) must be a valid UUID'),

      body('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),

      // Content
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

      body('milestones')
        .optional()
        .custom((value) => {
          if (typeof value !== 'object') {
            throw new Error('Milestones must be an object or array');
          }
          return true;
        }),

      // Dates
      body('startDate')
        .isDate()
        .withMessage('Start date must be a valid date'),

      body('endDate')
        .isDate()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
          if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
          }
          return true;
        }),

      // Status
      body('status')
        .optional()
        .isIn(['pending', 'approved', 'declined', 'on_hold', 'closed'])
        .withMessage('Invalid status value'),
    ];
  }

  /**
   * Validation rules for updating a project
   */
  static updateRules() {
    return [
      body('maker').optional().isUUID(),
      body('budgetId').optional().isUUID(),
      body('title').optional().isString().notEmpty(),
      body('description').optional().isString(),
      body('milestones')
        .optional()
        .custom((value) => {
          if (typeof value !== 'object') {
            throw new Error('Milestones must be an object or array');
          }
          return true;
        }),
      body('startDate').optional().isDate(),
      body('endDate')
        .optional()
        .isDate()
        .custom((value, { req }) => {
          if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
          }
          return true;
        }),
      body('status')
        .optional()
        .isIn(['pending', 'approved', 'declined', 'on_hold', 'closed'])
        .withMessage('Invalid status value'),
    ];
  }

  /**
   * Validation rules for querying projects
   */
  static queryRules() {
    return [
      query('maker').optional().isUUID(),
      query('budgetId').optional().isUUID(),
      query('title').optional().isString(),
      query('description').optional().isString(),
      query('milestones').optional().isString(), // JSON queries are usually passed as string
      query('startDate').optional().isDate(),
      query('endDate').optional().isDate(),
      query('status')
        .optional()
        .isIn(['pending', 'approved', 'declined', 'on_hold', 'closed'])
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

module.exports = ProjectDeserializer;
