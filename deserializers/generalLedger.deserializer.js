const { body, query } = require('express-validator');

class GeneralLedgerDeserializer {
  static createRules() {
    return [
      body('glCode')
        .isString()
        .notEmpty()
        .withMessage('GL Code is required'),
      
      body('glName')
        .isString()
        .notEmpty()
        .withMessage('GL Name is required'),
      
      body('description')
        .optional()
        .isString(),
      
      body('currentBalance')
        .optional()
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Current balance must be a decimal with up to two decimal places'),
      
      body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be boolean')
    ];
  }

  static updateRules() {
    return [
      body('glCode').optional().isString().notEmpty(),
      body('glName').optional().isString().notEmpty(),
      body('description').optional().isString(),
      body('currentBalance').optional().isDecimal({ decimal_digits: '0,2' }),
      body('isActive').optional().isBoolean()
    ];
  }

  static queryRules() {
    return [
      query('glCode').optional().isString(),
      query('glName').optional().isString(),
      query('isActive').optional().isBoolean(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ];
  }
}




module.exports = GeneralLedgerDeserializer;