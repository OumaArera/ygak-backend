const parseJSONFields = (fields) => {
  return (req, res, next) => {
    try {
      for (const field of fields) {
        if (req.body[field] && typeof req.body[field] === 'string') {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (parseError) {
            // Stop execution here completely
            return res.status(400).json({
              success: false,
              message: `Invalid JSON format in field: ${field}`,
              error: parseError.message,
            });
          }
        }
      }

      // Only reach this point if all JSON fields were parsed successfully
      next();

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Error parsing JSON fields',
        error: error.message,
      });
    }
  };
};

module.exports = parseJSONFields;
