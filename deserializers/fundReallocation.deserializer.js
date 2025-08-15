const { body, query } = require('express-validator');

class FundReallocationDeserializer {
  static createRules() {
    return [
      body('fromAllocationId')
        .isUUID()
        .withMessage('From Allocation ID must be a valid UUID'),
      
      body('toBudgetId')
        .isUUID()
        .withMessage('To Budget ID must be a valid UUID'),
      
      body('reallocationAmount')
        .isDecimal({ decimal_digits: '0,2' })
        .custom((value) => {
          if (parseFloat(value) <= 0) {
            throw new Error('Reallocation amount must be greater than 0');
          }
          return true;
        }),
      
      body('justification')
        .isString()
        .notEmpty()
        .withMessage('Justification is required'),
      
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
        .isIn(['Pending Approval', 'Approved', 'Declined', 'Completed'])
    ];
  }

  static updateRules() {
    return [
      body('reallocationAmount').optional().isDecimal({ decimal_digits: '0,2' }),
      body('justification').optional().isString().notEmpty(),
      body('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('secretaryDeclineReason').optional().isString(),
      body('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('chairpersonDeclineReason').optional().isString(),
      body('status').optional().isIn(['Pending Approval', 'Approved', 'Declined', 'Completed'])
    ];
  }

  static queryRules() {
    return [
      query('requesterId').optional().isUUID(),
      query('fromAllocationId').optional().isUUID(),
      query('toBudgetId').optional().isUUID(),
      query('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('status').optional().isIn(['Pending Approval', 'Approved', 'Declined', 'Completed']),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ];
  }
}

module.exports=FundReallocationDeserializer;