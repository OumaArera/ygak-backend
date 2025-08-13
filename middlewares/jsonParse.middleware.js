const parseJSONFields = (fields) => {
  return (req, res, next) => {
    try {
      fields.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: `Invalid JSON format in field: ${field}`,
              error: parseError.message
            });
          }
        }
      });
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error parsing JSON fields',
        error: error.message
      });
    }
  };
};

module.exports = parseJSONFields;