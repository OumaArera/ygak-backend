const { body, query } = require('express-validator');

const ActivityTrackerDTO = {
  // For GET requests
  filterValidation: [
    query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
    query('model').optional().isString().withMessage('Model must be a string'),
    query('userId').optional().isInt().withMessage('User ID must be an integer')
  ]
};

module.exports = ActivityTrackerDTO;
