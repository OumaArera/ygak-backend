const { body, query } = require('express-validator');
const validateInternationalPhone = require('../utils/validatePhone');

class UserDTO {
  /**
   * Validation for creating a user
   */
  static createRules() {
    return [
      body('firstName')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),

      body('lastName')
        .isString()
        .notEmpty()
        .withMessage('Last name is required'),

      body('phoneNumber')
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        })
        .notEmpty()
        .withMessage('Phone number is required'),

      body('email')
        .isEmail()
        .withMessage('Valid email is required'),

      body('regNumber')
        .optional()
        .isString(),

      body('designation')
        .isIn(['Board Member', 'Secretariat', 'Chapter', 'IT'])
        .withMessage('Invalid designation'),

      body('role')
        .isIn([
          'Secretary',
          'Treasurer',
          'Chairman',
          'Member',
          'CEO',
          'Chapter Coordinator',
          'Superuser',
          'Manager',
          'Junior',
          'Intern'
        ])
        .withMessage('Invalid role'),

      body('isActive')
        .optional()
        .isBoolean(),

      body('isSuperUser')
        .optional()
        .isBoolean(),

      body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

      body('isStaff')
        .optional()
        .isBoolean(),
    ];
  }

  /**
   * Validation for updating a user
   */
  static updateRules() {
    return [
      body('firstName')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('First name cannot be empty'),

      body('lastName')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Last name cannot be empty'),

      body('phoneNumber')
        .optional()
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        }),

      body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required'),

      body('regNumber')
        .optional()
        .isString(),

      body('designation')
        .optional()
        .isIn(['Board Member', 'Secretariat', 'Chapter', 'IT'])
        .withMessage('Invalid designation'),

      body('role')
        .optional()
        .isIn([
          'Secretary',
          'Treasurer',
          'Chairman',
          'Member',
          'CEO',
          'Chapter Coordinator',
          'Superuser',
          'Manager',
          'Junior',
          'Intern'
        ])
        .withMessage('Invalid role'),

      body('isActive')
        .optional()
        .isBoolean(),

      body('isSuperUser')
        .optional()
        .isBoolean(),

      body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

      body('isStaff')
        .optional()
        .isBoolean(),
    ];
  }

  /**
   * Validation for searching/querying users
   */
  static queryRules() {
    return [
      query('firstName').optional().isString(),
      query('lastName').optional().isString(),
      query('phoneNumber')
        .optional()
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        }),
      query('email').optional().isEmail(),
      query('regNumber').optional().isString(),
      query('designation')
        .optional()
        .isIn(['Board Member', 'Secretariat', 'Chapter', 'IT']),
      query('role')
        .optional()
        .isIn([
          'Secretary',
          'Treasurer',
          'Chairman',
          'Member',
          'CEO',
          'Chapter Coordinator',
          'Superuser',
          'Manager',
          'Junior',
          'Intern'
        ]),
      query('isActive').optional().isBoolean(),
      query('isSuperUser').optional().isBoolean(),
      query('isStaff').optional().isBoolean(),
    ];
  }
}

module.exports = UserDTO;
