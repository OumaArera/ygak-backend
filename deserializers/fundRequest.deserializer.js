const { body, query } = require('express-validator');

class FundRequestDeserializer {
  static createRules() {
    return [
      body('budgetId')
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      body('glId')
        .isUUID()
        .withMessage('General Ledger ID must be a valid UUID'),
      
      body('requestedAmount')
        .isDecimal({ decimal_digits: '0,2' })
        .custom((value) => {
          if (parseFloat(value) <= 0) {
            throw new Error('Requested amount must be greater than 0');
          }
          return true;
        })
        .withMessage('Requested amount must be a positive decimal'),
      
      body('purpose')
        .isString()
        .notEmpty()
        .withMessage('Purpose is required'),
      
      body('urgencyLevel')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid urgency level'),
      
      body('secretaryApprovalStatus')
        .optional()
        .isIn(['pending', 'approved', 'declined']),
      
      body('secretaryDeclineReason')
        .optional()
        .isString(),
      
      body('chairpersonApprovalStatus')
        .optional()
        .isIn(['pending', 'approved', 'declined']),
      
      body('chairpersonDeclineReason')
        .optional()
        .isString(),
      
      body('status')
        .optional()
        .isIn(['Pending Approval', 'Approved', 'Declined', 'Allocated'])
    ];
  }

  static updateRules() {
    return [
      body('requestedAmount').optional().isDecimal({ decimal_digits: '0,2' }),
      body('purpose').optional().isString().notEmpty(),
      body('urgencyLevel').optional().isIn(['low', 'medium', 'high']),
      body('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('secretaryDeclineReason').optional().isString(),
      body('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('chairpersonDeclineReason').optional().isString(),
      body('status').optional().isIn(['Pending Approval', 'Approved', 'Declined', 'Allocated'])
    ];
  }

  static queryRules() {
    return [
      query('budgetId').optional().isUUID(),
      query('glId').optional().isUUID(),
      query('requesterId').optional().isUUID(),
      query('urgencyLevel').optional().isIn(['low', 'medium', 'high']),
      query('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('status').optional().isIn(['Pending Approval', 'Approved', 'Declined', 'Allocated']),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ];
  }
}

module.exports=FundRequestDeserializer;