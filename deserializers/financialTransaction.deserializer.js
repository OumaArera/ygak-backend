const { body, query } = require('express-validator');

class FinancialTransactionDeserializer {
  static createRules() {
    return [
      body('glId')
        .isUUID()
        .withMessage('General Ledger ID must be a valid UUID'),
      
      body('budgetId')
        .optional()
        .isUUID()
        .withMessage('Budget ID must be a valid UUID'),
      
      body('paymentId')
        .optional()
        .isUUID()
        .withMessage('Payment ID must be a valid UUID'),
      
      body('allocationId')
        .optional()
        .isUUID()
        .withMessage('Allocation ID must be a valid UUID'),
      
      body('transactionType')
        .isIn([
          'fund_allocation',
          'payment',
          'reallocation_debit',
          'reallocation_credit',
          'adjustment',
          'reversal'
        ])
        .withMessage('Invalid transaction type'),
      
      body('debitAmount')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .custom((value) => {
          if (value && parseFloat(value) < 0) {
            throw new Error('Debit amount cannot be negative');
          }
          return true;
        }),
      
      body('creditAmount')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .custom((value) => {
          if (value && parseFloat(value) < 0) {
            throw new Error('Credit amount cannot be negative');
          }
          return true;
        }),
      
      body('description')
        .isString()
        .notEmpty()
        .withMessage('Description is required'),
      
      body('transactionDate')
        .optional()
        .isISO8601()
        .withMessage('Transaction date must be a valid date')
    ];
  }

  static queryRules() {
    return [
      query('glId').optional().isUUID(),
      query('budgetId').optional().isUUID(),
      query('paymentId').optional().isUUID(),
      query('allocationId').optional().isUUID(),
      query('processedBy').optional().isUUID(),
      query('transactionType').optional().isIn([
        'fund_allocation',
        'payment',
        'reallocation_debit',
        'reallocation_credit',
        'adjustment',
        'reversal'
      ]),
      query('transactionDateFrom').optional().isISO8601(),
      query('transactionDateTo').optional().isISO8601(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ];
  }
}

module.exports=FinancialTransactionDeserializer;