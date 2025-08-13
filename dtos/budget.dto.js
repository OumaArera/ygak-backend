const { body, query } = require('express-validator');

class BudgetDTO {
  /**
   * Validation for creating a budget
   */
  static createRules() {
    return [
      // Required fields
      body('userId')
        .optional()
        .isUUID()
        .withMessage('User ID must be a valid UUID'),

      body('amount')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Amount must be a decimal with up to two decimal places'),

      body('reason')
        .isString()
        .notEmpty()
        .withMessage('Reason is required'),

      // File validation - only validate if files exist
      body('invoice')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.invoice && req.files.invoice.length > 0) {
            const file = req.files.invoice[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid invoice file type. Allowed: PDF, JPEG, JPG, PNG');
            }
          }
          return true;
        }),

      body('receipt')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.receipt && req.files.receipt.length > 0) {
            const file = req.files.receipt[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid receipt file type. Allowed: PDF, JPEG, JPG, PNG');
            }
          }
          return true;
        }),

      body('recipient')
        .isObject()
        .withMessage('Recipient must be a valid object')
        .custom((value) => {
          const allowedTypes = [
            'Bank Transfer',
            'Mpesa Pay Bill',
            'Mpesa Buy Goods',
            'Mpesa Pochi la Biashara',
            'Mpesa Send Money'
          ];
          
          if (!value.typeOfPayment || !allowedTypes.includes(value.typeOfPayment)) {
            throw new Error(`Invalid typeOfPayment. Allowed: ${allowedTypes.join(', ')}`);
          }

          // Conditional validation based on payment type
          switch (value.typeOfPayment) {
            case 'Mpesa Send Money':
            case 'Mpesa Pochi la Biashara':
              if (!value.mpesaNumber || typeof value.mpesaNumber !== 'string') {
                throw new Error('mpesaNumber is required for Mpesa Send Money or Mpesa Pochi la Biashara');
              }
              break;
              
            case 'Mpesa Buy Goods':
              if (!value.mpesaBuyGoodsTill || typeof value.mpesaBuyGoodsTill !== 'string') {
                throw new Error('mpesaBuyGoodsTill is required for Mpesa Buy Goods');
              }
              break;
              
            case 'Mpesa Pay Bill':
              if (!value.mpesaPayBillDetails || 
                  typeof value.mpesaPayBillDetails.businessNumber !== 'string' ||
                  typeof value.mpesaPayBillDetails.accountNumber !== 'string') {
                throw new Error('mpesaPayBillDetails with businessNumber and accountNumber required for Mpesa Pay Bill');
              }
              break;
              
            case 'Bank Transfer':
              if (!value.bankDetails ||
                  typeof value.bankDetails.accountNumber !== 'string' ||
                  typeof value.bankDetails.bankName !== 'string' ||
                  typeof value.bankDetails.bankCode !== 'string') {
                throw new Error('bankDetails with accountNumber, bankName, and bankCode required for Bank Transfer');
              }
              break;
          }
          return true;
        }),

      body('particulars')
        .isArray({ min: 1 })
        .withMessage('Particulars must be a non-empty array')
        .custom((arr) => {
          if (!Array.isArray(arr)) {
            throw new Error('Particulars must be an array');
          }
          
          arr.forEach((item, index) => {
            if (!item.id || typeof item.id !== 'string') {
              throw new Error(`Particulars[${index}].id is required and must be a string`);
            }
            if (!item.item || typeof item.item !== 'string') {
              throw new Error(`Particulars[${index}].item is required and must be a string`);
            }
            if (!item.description || typeof item.description !== 'string') {
              throw new Error(`Particulars[${index}].description is required and must be a string`);
            }
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
              throw new Error(`Particulars[${index}].quantity must be a positive number`);
            }
            if (typeof item.unitCost !== 'number' || item.unitCost <= 0) {
              throw new Error(`Particulars[${index}].unitCost must be a positive number`);
            }
            if (typeof item.total !== 'number' || item.total <= 0) {
              throw new Error(`Particulars[${index}].total must be a positive number`);
            }
          });
          return true;
        }),

      // Approval Status Fields
      body('secretaryApprovalStatus')
        .optional()
        .isIn(['pending', 'approved', 'declined'])
        .withMessage('Invalid secretary approval status'),

      body('secretaryDeclineReason')
        .optional()
        .isString(),

      body('chairpersonApprovalStatus')
        .optional()
        .isIn(['pending', 'approved', 'declined'])
        .withMessage('Invalid chairperson approval status'),

      body('chairpersonDeclineReason')
        .optional()
        .isString(),

      body('treasurerApprovalStatus')
        .optional()
        .isIn(['pending', 'approved', 'declined'])
        .withMessage('Invalid treasurer approval status'),

      body('treasurerDeclineReason')
        .optional()
        .isString(),

      body('status')
        .optional()
        .isIn([
          'Pending Approval',
          'Approved Pending Disbursement',
          'Declined',
          'Disbursed Pending Receipts',
          'Closed'
        ])
        .withMessage('Invalid budget status'),
    ];
  }

  /**
   * Validation for updating a budget
   */
  static updateRules() {
    return [
      body('userId').optional().isUUID(),
      body('amount').optional().isDecimal({ decimal_digits: '0,2' }),
      body('reason').optional().isString().notEmpty(),
      
      // File validation - only if files are provided
      body('invoice')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.invoice && req.files.invoice.length > 0) {
            const file = req.files.invoice[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid invoice file type');
            }
          }
          return true;
        }),

      body('receipt')
        .optional()
        .custom((value, { req }) => {
          if (req.files && req.files.receipt && req.files.receipt.length > 0) {
            const file = req.files.receipt[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error('Invalid receipt file type');
            }
          }
          return true;
        }),
        
      body('recipient')
        .optional()
        .isObject()
        .withMessage('Recipient must be a valid object')
        .custom((value) => {
          if (!value) return true; // Skip if not provided
          
          const allowedTypes = [
            'Bank Transfer',
            'Mpesa Pay Bill',
            'Mpesa Buy Goods',
            'Mpesa Pochi la Biashara',
            'Mpesa Send Money'
          ];
          
          if (!allowedTypes.includes(value.typeOfPayment)) {
            throw new Error(`Invalid typeOfPayment. Allowed: ${allowedTypes.join(', ')}`);
          }

          // Same conditional validation as create
          switch (value.typeOfPayment) {
            case 'Mpesa Send Money':
            case 'Mpesa Pochi la Biashara':
              if (!value.mpesaNumber || typeof value.mpesaNumber !== 'string') {
                throw new Error('mpesaNumber is required for Mpesa Send Money or Mpesa Pochi la Biashara');
              }
              break;
              
            case 'Mpesa Buy Goods':
              if (!value.mpesaBuyGoodsTill || typeof value.mpesaBuyGoodsTill !== 'string') {
                throw new Error('mpesaBuyGoodsTill is required for Mpesa Buy Goods');
              }
              break;
              
            case 'Mpesa Pay Bill':
              if (!value.mpesaPayBillDetails || 
                  typeof value.mpesaPayBillDetails.businessNumber !== 'string' ||
                  typeof value.mpesaPayBillDetails.accountNumber !== 'string') {
                throw new Error('mpesaPayBillDetails with businessNumber and accountNumber required for Mpesa Pay Bill');
              }
              break;
              
            case 'Bank Transfer':
              if (!value.bankDetails ||
                  typeof value.bankDetails.accountNumber !== 'string' ||
                  typeof value.bankDetails.bankName !== 'string' ||
                  typeof value.bankDetails.bankCode !== 'string') {
                throw new Error('bankDetails with accountNumber, bankName, and bankCode required for Bank Transfer');
              }
              break;
          }
          return true;
        }),

      body('particulars')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Particulars must be a non-empty array')
        .custom((arr) => {
          if (!arr) return true; // Skip if not provided
          
          arr.forEach((item, index) => {
            if (!item.id || typeof item.id !== 'string') {
              throw new Error(`Particulars[${index}].id is required and must be a string`);
            }
            if (!item.item || typeof item.item !== 'string') {
              throw new Error(`Particulars[${index}].item is required and must be a string`);
            }
            if (!item.description || typeof item.description !== 'string') {
              throw new Error(`Particulars[${index}].description is required and must be a string`);
            }
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
              throw new Error(`Particulars[${index}].quantity must be a positive number`);
            }
            if (typeof item.unitCost !== 'number' || item.unitCost <= 0) {
              throw new Error(`Particulars[${index}].unitCost must be a positive number`);
            }
            if (typeof item.total !== 'number' || item.total <= 0) {
              throw new Error(`Particulars[${index}].total must be a positive number`);
            }
          });
          return true;
        }),
        
      // Status fields
      body('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('secretaryDeclineReason').optional().isString(),
      body('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('chairpersonDeclineReason').optional().isString(),
      body('treasurerApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      body('treasurerDeclineReason').optional().isString(),
      body('status').optional().isIn([
        'Pending Approval',
        'Approved Pending Disbursement',
        'Declined',
        'Disbursed Pending Receipts',
        'Closed'
      ]),
    ];
  }

  /**
   * Validation for querying/searching budgets
   */
  static queryRules() {
    return [
      query('userId').optional().isUUID(),
      query('amount').optional().isDecimal({ decimal_digits: '0,2' }),
      query('reason').optional().isString(),
      query('secretaryApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('chairpersonApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('treasurerApprovalStatus').optional().isIn(['pending', 'approved', 'declined']),
      query('status').optional().isIn([
        'Pending Approval',
        'Approved Pending Disbursement',
        'Declined',
        'Disbursed Pending Receipts',
        'Closed'
      ]),
    ];
  }
}

module.exports = BudgetDTO;