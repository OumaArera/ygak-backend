const { body, query } = require('express-validator');
const validateInternationalPhone = require('../utils/validatePhone');

class VolunteerDTO {
  /**
   * Validation for creating a volunteer
   */
  static createRules() {
    return [
      body('firstName')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),

      body('otherNames')
        .isString()
        .notEmpty()
        .withMessage('Other names are required'),

      body('sex')
        .isIn(['Male', 'Female'])
        .withMessage('Sex must be either Male or Female'),

      body('dateOfBirth')
        .isDate()
        .withMessage('Date of birth must be a valid date')
        .custom((value) => {
          const today = new Date();
          const dob = new Date(value);
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          if (age < 16) {
            throw new Error('Volunteer must be at least 16 years old.');
          }
          return true;
        }),

      // Contact Information
      body('phoneNumber')
        .isString()
        .notEmpty()
        .withMessage('Phone number is required')
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        }),

      body('email')
        .isEmail()
        .withMessage('Valid email is required'),

      // Next of Kin
      body('nextOfKinName')
        .isString()
        .notEmpty()
        .withMessage('Next of kin name is required'),

      body('nextOfKinPhoneNumber')
        .isString()
        .notEmpty()
        .withMessage('Next of kin phone number is required')
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid next of kin phone number format');
          }
          return true;
        }),

      body('nextOfKinEmail')
        .optional()
        .isEmail()
        .withMessage('Next of kin email must be valid'),

      // Student / Non-student logic
      body('isStudent')
        .optional()
        .isBoolean()
        .toBoolean(),

      body('institutionId')
        .if(body('isStudent').equals(true))
        .isUUID()
        .withMessage('Institution ID must be a valid UUID when isStudent is true'),

      body('schoolRegNumber')
        .if(body('isStudent').equals(true))
        .isString()
        .notEmpty()
        .withMessage('School registration number is required when isStudent is true'),

      body('identificationNumber')
        .if(body('isStudent').equals(false))
        .isString()
        .notEmpty()
        .withMessage('Identification number is required when isStudent is false'),

      // Registration
      body('regNumber')
        .isString()
        .optional()
        .notEmpty(),

      // Location
      body('countyOfResidence')
        .isString()
        .notEmpty()
        .withMessage('County of residence is required'),

      body('subCountyOfResidence')
        .isString()
        .notEmpty()
        .withMessage('Sub-county of residence is required'),

      body('nationality')
        .isString()
        .notEmpty()
        .withMessage('Nationality is required'),

      // Status Flags
      body('isApproved').optional().isBoolean(),
      body('isExpelled').optional().isBoolean(),
      body('isSuspended').optional().isBoolean(),
    ];
  }

  /**
   * Validation for updating a volunteer
   */
  static updateRules() {
    return [
      // Personal Information
      body('firstName').optional().isString().notEmpty(),
      body('otherNames').optional().isString().notEmpty(),
      body('sex').optional().isIn(['Male', 'Female']),
      body('dateOfBirth')
        .optional()
        .isDate()
        .custom((value) => {
          const today = new Date();
          const dob = new Date(value);
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          if (age < 16) {
            throw new Error('Volunteer must be at least 16 years old.');
          }
          return true;
        }),

      // Contact Information
      body('phoneNumber')
        .optional()
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        }),
      body('email').optional().isEmail(),

      // Next of Kin
      body('nextOfKinName').optional().isString().notEmpty(),
      body('nextOfKinPhoneNumber')
        .optional()
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid next of kin phone number format');
          }
          return true;
        }),
      body('nextOfKinEmail').optional().isEmail(),

      // Student / Non-student logic
      body('isStudent').optional().isBoolean().toBoolean(),
      body('institutionId')
        .if(body('isStudent').equals(true))
        .isUUID()
        .withMessage('Institution ID must be a valid UUID when isStudent is true'),
      body('schoolRegNumber')
        .if(body('isStudent').equals(true))
        .isString()
        .notEmpty()
        .withMessage('School registration number is required when isStudent is true'),
      body('identificationNumber')
        .if(body('isStudent').equals(false))
        .isString()
        .notEmpty()
        .withMessage('Identification number is required when isStudent is false'),

      // Registration
      body('regNumber').optional().isString().notEmpty(),

      // Location
      body('countyOfResidence').optional().isString().notEmpty(),
      body('subCountyOfResidence').optional().isString().notEmpty(),
      body('nationality').optional().isString().notEmpty(),

      // Status Flags
      body('isApproved').optional().isBoolean(),
      body('isExpelled').optional().isBoolean(),
      body('isSuspended').optional().isBoolean(),
    ];
  }

  /**
   * Validation for searching/querying volunteers
   */
  static queryRules() {
    return [
      query('firstName').optional().isString(),
      query('otherNames').optional().isString(),
      query('sex').optional().isIn(['Male', 'Female']),
      query('dateOfBirth').optional().isDate(),
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
      query('nextOfKinName').optional().isString(),
      query('nextOfKinPhoneNumber')
        .optional()
        .isString()
        .custom((value) => {
          if (!validateInternationalPhone(value)) {
            throw new Error('Invalid phone number format');
          }
          return true;
        }),
      query('nextOfKinEmail').optional().isEmail(),
      query('isStudent').optional().isBoolean(),
      query('institutionId').optional().isUUID(),
      query('schoolRegNumber').optional().isString(),
      query('identificationNumber').optional().isString(),
      query('regNumber').optional().isString(),
      query('countyOfResidence').optional().isString(),
      query('subCountyOfResidence').optional().isString(),
      query('nationality').optional().isString(),
      query('isApproved').optional().isBoolean(),
      query('isExpelled').optional().isBoolean(),
      query('isSuspended').optional().isBoolean(),
      query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
    ];
  }
}

module.exports = VolunteerDTO;
