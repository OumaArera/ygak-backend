const { body, query } = require('express-validator');

class PaymentDeserializer {
  static createRules() {
    return [
      body('budgetId')
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      body('allocationId')
        .isUUID()
        .withMessage('Allocation ID must be a valid UUID'),
      
      body('paymentAmount')
        .isDecimal({ decimal_digits: '0,2' })
        .custom((value) => {
          if (parseFloat(value) <= 0) {
            throw new Error('Payment amount must be greater than 0');
          }
          return true;
        }),
      
      body('paymentMethod')
        .isIn([
          'Bank Transfer',
          'Mpesa Pay Bill',
          'Mpesa Buy Goods',
          'Mpesa Pochi la Biashara',
          'Mpesa Send Money',
          'Cash',
          'Cheque'
        ])
        .withMessage('Invalid payment method'),
      
      body('transactionReference')
        .optional()
        .isString(),
      
      body('paymentDate')
        .optional()
        .isISO8601()
        .withMessage('Payment date must be a valid date'),
      
      body('description')
        .optional()
        .isString(),
      
      // File validation for supporting document
      body('supportingDocument')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.supportingDocument && req.files.supportingDocument.length > 0) {
            const file = req.files.supportingDocument[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid supporting document file type. Allowed: PDF, JPEG, JPG, PNG');
            }
          }
          return true;
        }),
      
      body('status')
        .optional()
        .isIn(['pending', 'completed', 'failed', 'reversed'])
    ];
  }

  static updateRules() {
    return [
      body('paymentAmount').optional().isDecimal({ decimal_digits: '0,2' }),
      body('paymentMethod').optional().isIn([
        'Bank Transfer',
        'Mpesa Pay Bill',
        'Mpesa Buy Goods',
        'Mpesa Pochi la Biashara',
        'Mpesa Send Money',
        'Cash',
        'Cheque'
      ]),
      body('transactionReference').optional().isString(),
      body('paymentDate').optional().isISO8601(),
      body('description').optional().isString(),
      body('supportingDocument')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.supportingDocument && req.files.supportingDocument.length > 0) {
            const file = req.files.supportingDocument[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid supporting document file type');
            }
          }
          return true;
        }),
      body('status').optional().isIn(['pending', 'completed', 'failed', 'reversed'])
    ];
  }

  static queryRules() {
    return [
      query('budgetId').optional().isUUID(),
      query('allocationId').optional().isUUID(),
      query('paidBy').optional().isUUID(),
      query('paymentMethod').optional().isIn([
        'Bank Transfer',
        'Mpesa Pay Bill',
        'Mpesa Buy Goods',
        'Mpesa Pochi la Biashara',
        'Mpesa Send Money',
        'Cash',
        'Cheque'
      ]),
      query('status').optional().isIn(['pending', 'completed', 'failed', 'reversed']),
      query('paymentDateFrom').optional().isISO8601(),
      query('paymentDateTo').optional().isISO8601(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ];
  }
}

module.exports=PaymentDeserializer;