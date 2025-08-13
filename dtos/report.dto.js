const { body, query } = require('express-validator');

class ReportDTO {
  /**
   * Validation rules for creating a report
   */
  static createRules() {
    return [
      // Associations
      body('userId')
        .optional()
        .isUUID()
        .withMessage('User ID must be a valid UUID'),

      body('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),

      // Content
      body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required'),

      body('content')
        .custom((value, { req }) => {
            if (!req.files || !req.files.content || req.files.content.length === 0) {
            throw new Error('Content is required');
            }

            const file = req.files.content[0];
            const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Allowed: PDF, Word (DOC, DOCX), Excel (XLS, XLSX)');
            }

            return true;
        }),

      body('comments')
        .optional()
        .isString(),

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

      // Status Flags
      body('isPending').optional().isBoolean(),
      body('isComplete').optional().isBoolean(),
      body('isApproved').optional().isBoolean(),
      body('isDeclined').optional().isBoolean(),

      // Decline Reason
      body('declineReason')
        .optional()
        .isString()
        .withMessage('Decline reason must be a string if provided'),
    ];
  }

  /**
   * Validation rules for updating a report
   */
  static updateRules() {
    return [
      body('userId').optional().isUUID(),
      body('budgetId').optional().isUUID(),
      body('title').optional().isString().notEmpty(),
      body('content')
        .optional()
        .custom((value, { req }) => {
            if (!req.files || !req.files.content || req.files.content.length === 0) {
            throw new Error('Content is required');
            }

            const file = req.files.content[0];
            const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Allowed: PDF, Word (DOC, DOCX), Excel (XLS, XLSX)');
            }

            return true;
        }),
      body('comments').optional().isString(),
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
      body('isPending').optional().isBoolean(),
      body('isComplete').optional().isBoolean(),
      body('isApproved').optional().isBoolean(),
      body('isDeclined').optional().isBoolean(),
      body('declineReason').optional().isString(),
    ];
  }

  /**
   * Validation rules for querying reports
   */
  static queryRules() {
    return [
      query('userId').optional().isUUID(),
      query('budgetId').optional().isUUID(),
      query('title').optional().isString(),
      query('content').optional().isString(),
      query('comments').optional().isString(),
      query('startDate').optional().isDate(),
      query('endDate').optional().isDate(),
      query('isPending').optional().isBoolean(),
      query('isComplete').optional().isBoolean(),
      query('isApproved').optional().isBoolean(),
      query('isDeclined').optional().isBoolean(),
      query('declineReason').optional().isString(),
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

module.exports = ReportDTO;
