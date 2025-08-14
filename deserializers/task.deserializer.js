const { body, query } = require('express-validator');

class TaskDeserializer {
  /**
   * Validation rules for creating a task
   */
  static createRules() {
    return [
      // Associations
      body('assignedTo')
        .isUUID()
        .withMessage('AssignedTo must be a valid UUID'),

      // Task details
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('details')
        .isString()
        .notEmpty()
        .withMessage('Details are required'),

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
    ];
  }

  /**
   * Validation rules for updating a task
   */
  static updateRules() {
    return [
      body('assignedTo')
        .optional()
        .isUUID()
        .withMessage('AssignedTo must be a valid UUID'),

      body('title')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Title cannot be empty'),

      body('details')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Details cannot be empty'),

      body('startDate')
        .optional()
        .isDate()
        .withMessage('Start date must be a valid date'),

      body('endDate')
        .optional()
        .isDate()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
          if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for querying tasks
   */
  static queryRules() {
    return [
      query('assignedTo').optional().isUUID(),
      query('title').optional().isString(),
      query('details').optional().isString(),
      query('startDate').optional().isDate(),
      query('endDate').optional().isDate(),
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

module.exports = TaskDeserializer;
