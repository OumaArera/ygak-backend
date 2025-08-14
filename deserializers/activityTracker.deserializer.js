const { body, query } = require('express-validator');

const ActivityTrackerDeserializer = {
  // For GET requests
  filterValidation: [
    query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
    query('model').optional().isString().withMessage('Model must be a string'),
    query('userId').optional().isInt().withMessage('User ID must be an integer'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a positive integer between 1 and 100')
  ]
};

module.exports = ActivityTrackerDeserializer;
