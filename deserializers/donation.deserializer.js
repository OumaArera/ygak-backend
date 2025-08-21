const { body, query } = require('express-validator');

class DonationDeserializer {
  /**
   * Validation rules for creating a donation
   */
  static createRules() {
    return [
      body('firstName')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),

      body('otherNames')
        .optional()
        .isString(),
        
      body('type')
        .isIn(['Mpesa', 'Debit Card', 'PayPal'])
        .withMessage('Donation type must be Mpesa, Debit Card, or PayPal'),
      
      body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),

      body('mpesaNumber')
        .optional()
        .isString(),

      body('debitCardNumber')
        .optional()
        .isString(),

      body('paypalEmail')
        .optional()
        .isEmail()
        .withMessage('PayPal email must be a valid email address'),

      body('transactionId')
        .optional()
        .isString()
        .withMessage('Transaction ID is required'),
      
      body('transactionalParticulars')
        .optional()
        .isJSON()
        .withMessage('Transactional particulars must be a valid JSON object'),
      
      body('donorEmail')
        .optional()
        .isEmail()
        .withMessage('Donor email must be a valid email address'),
      
      body('donorPhoneNumber')
        .optional()
        .isString(),

      body('status')
        .optional()
        .isIn(['Pending', 'Paid', 'Declined'])
        .withMessage('Status must be Pending, Paid, or Declined'),
    ];
  }

  /**
   * Validation rules for updating a donation
   */
  static updateRules() {
    return [
      body('firstName').optional().isString().notEmpty(),
      body('otherNames').optional().isString(),
      body('type').optional().isIn(['Mpesa', 'Debit Card', 'PayPal']),
      body('amount').optional().isFloat({ min: 0.01 }),
      body('mpesaNumber').optional().isString(),
      body('debitCardNumber').optional().isString(),
      body('paypalEmail').optional().isEmail(),
      body('transactionId').optional().isString().notEmpty(),
      body('transactionalParticulars').optional().isJSON(),
      body('donorEmail').optional().isEmail(),
      body('donorPhoneNumber').optional().isString(),
      body('status').optional().isIn(['Pending', 'Paid', 'Declined']),
    ];
  }

  /**
   * Validation rules for querying donations
   */
  static queryRules() {
    return [
      query('firstName').optional().isString(),
      query('otherNames').optional().isString(),
      query('type').optional().isIn(['Mpesa', 'Debit Card', 'PayPal']),
      query('amount').optional().isFloat({ min: 0.01 }),
      query('mpesaNumber').optional().isString(),
      query('debitCardNumber').optional().isString(),
      query('paypalEmail').optional().isEmail(),
      query('transactionId').optional().isString(),
      query('donorEmail').optional().isEmail(),
      query('donorPhoneNumber').optional().isString(),
      query('status').optional().isIn(['Pending', 'Paid', 'Declined']),
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

module.exports = DonationDeserializer;