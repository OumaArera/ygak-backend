const { body } = require('express-validator');

class AuthDeserializer {
  static loginRules() {
    return [
      body('email')
        .isEmail()
        .withMessage('Valid email is required'),

      body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required'),
    ];
  }

  static changePasswordRules() {
    return [
      body('email')
        .isEmail()
        .withMessage('Valid email is required'),
        
      body('oldPassword')
        .isString()
        .notEmpty()
        .withMessage('Old password is required'),

      body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long'),
    ];
  }
}

module.exports = AuthDeserializer;
