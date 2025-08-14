const { body } = require('express-validator');

class InstitutionDeserializer {
  createRules() {
    return [
      body('name').notEmpty().withMessage('Name is required'),
      body('county').notEmpty().withMessage('County is required'),
      body('subCounty').notEmpty().withMessage('Sub-county is required'),
      body('type')
        .isIn(['university', 'college', 'TVET', 'polytechnic'])
        .withMessage('Invalid institution type'),
      body('ownership')
        .isIn(['public', 'private'])
        .withMessage('Ownership must be either public or private')
    ];
  }

  updateRules() {
    return [
      body('name')
        .optional()
        .isString()
        .withMessage('Name is required'),
      body('county')
        .optional()
        .isString()
        .withMessage('County is required'),
      body('subCounty')
        .optional()
        .isString()
        .withMessage('Sub-county is required'),
      body('type')
        .optional()
        .isIn(['university', 'college', 'TVET', 'polytechnic'])
        .withMessage('Invalid institution type'),
      body('ownership')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('Ownership must be either public or private')
    ];
  }
}

module.exports = new InstitutionDeserializer();
