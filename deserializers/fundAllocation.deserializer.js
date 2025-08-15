const { body, query, param } = require('express-validator');

class FundAllocationDeserializer {
  static createRules() {
    return [
      body('fundRequestId')
        .notEmpty()
        .withMessage('Fund request ID is required')
        .isUUID()
        .withMessage('Fund request ID must be a valid UUID'),
      
      body('budgetId')
        .notEmpty()
        .withMessage('Budget ID is required')
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      body('glId')
        .notEmpty()
        .withMessage('General ledger ID is required')
        .isUUID()
        .withMessage('General ledger ID must be a valid UUID'),
      
      body('allocatedAmount')
        .notEmpty()
        .withMessage('Allocated amount is required')
        .isNumeric()
        .withMessage('Allocated amount must be a number')
        .custom((value) => {
          if (parseFloat(value) <= 0) {
            throw new Error('Allocated amount must be greater than 0');
          }
          return true;
        }),
      
      body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Expiry date must be a valid date')
        .custom((value) => {
          if (value && new Date(value) <= new Date()) {
            throw new Error('Expiry date must be in the future');
          }
          return true;
        }),
    ];
  }

  static updateRules() {
    return [
      body('fundRequestId')
        .optional()
        .isUUID()
        .withMessage('Fund request ID must be a valid UUID'),
      
      body('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      body('glId')
        .optional()
        .isUUID()
        .withMessage('General ledger ID must be a valid UUID'),
      
      body('allocatedAmount')
        .optional()
        .isNumeric()
        .withMessage('Allocated amount must be a number')
        .custom((value) => {
          if (value !== undefined && parseFloat(value) <= 0) {
            throw new Error('Allocated amount must be greater than 0');
          }
          return true;
        }),
      
      body('remainingAmount')
        .optional()
        .isNumeric()
        .withMessage('Remaining amount must be a number')
        .custom((value) => {
          if (value !== undefined && parseFloat(value) < 0) {
            throw new Error('Remaining amount cannot be negative');
          }
          return true;
        }),
      
      body('status')
        .optional()
        .isIn(['active', 'fully_utilized', 'reallocated'])
        .withMessage('Status must be one of: active, fully_utilized, reallocated'),
      
      body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Expiry date must be a valid date'),
    ];
  }

  static statusUpdateRules() {
    return [
      body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['active', 'fully_utilized', 'reallocated'])
        .withMessage('Status must be one of: active, fully_utilized, reallocated'),
    ];
  }

  static reallocationRules() {
    return [
      body('newBudgetId')
        .notEmpty()
        .withMessage('New budget ID is required')
        .isUUID()
        .withMessage('New budget ID must be a valid UUID'),
      
      body('newAmount')
        .optional()
        .isNumeric()
        .withMessage('New amount must be a number')
        .custom((value) => {
          if (value !== undefined && parseFloat(value) <= 0) {
            throw new Error('New amount must be greater than 0');
          }
          return true;
        }),
    ];
  }

  static queryRules() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      query('fundRequestId')
        .optional()
        .isUUID()
        .withMessage('Fund request ID must be a valid UUID'),
      
      query('glId')
        .optional()
        .isUUID()
        .withMessage('General ledger ID must be a valid UUID'),
      
      query('allocatedBy')
        .optional()
        .isUUID()
        .withMessage('Allocated by must be a valid UUID'),
      
      query('status')
        .optional()
        .isIn(['active', 'fully_utilized', 'reallocated'])
        .withMessage('Status must be one of: active, fully_utilized, reallocated'),
      
      query('minAmount')
        .optional()
        .isNumeric()
        .withMessage('Minimum amount must be a number'),
      
      query('maxAmount')
        .optional()
        .isNumeric()
        .withMessage('Maximum amount must be a number'),
      
      query('fromDate')
        .optional()
        .isISO8601()
        .withMessage('From date must be a valid date'),
      
      query('toDate')
        .optional()
        .isISO8601()
        .withMessage('To date must be a valid date'),
      
      query('sortBy')
        .optional()
        .isIn(['createdAt', 'allocatedAmount', 'remainingAmount', 'expiryDate'])
        .withMessage('Sort by must be one of: createdAt, allocatedAmount, remainingAmount, expiryDate'),
      
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    ];
  }

  static paramRules() {
    return [
      param('id')
        .isUUID()
        .withMessage('ID must be a valid UUID'),
    ];
  }
}

// module.exports = new FundAllocationDeserializer();

module.exports=FundAllocationDeserializer;