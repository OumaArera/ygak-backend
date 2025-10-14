const { body, query } = require('express-validator');

class BlogDeserializer {
  static createRules() {
    return [
      body('title').isString().notEmpty(),
      body('excerpt').isString().notEmpty(),
      body('category').isString().notEmpty(),
      body('author').isString().notEmpty(),
      body('paragraphs').isArray({ min: 1 }).withMessage('Paragraphs must be an array'),
      body('paragraphs.*.type').isString().notEmpty(),
      body('paragraphs.*.content').notEmpty(),
      body('sources').optional().isArray(),
      body('sources.*.url').optional().isURL(),
      body('isPublished').optional().isBoolean(),
      body('publishedAt').optional().isISO8601(),
    ];
  }

  static updateRules() {
    return this.createRules().map(rule => rule.optional());
  }

  static queryRules() {
    return [
      query('title').optional().isString(),
      query('category').optional().isString(),
      query('author').optional().isString(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
    ];
  }
}

module.exports = BlogDeserializer;
