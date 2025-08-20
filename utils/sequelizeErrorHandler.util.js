/**
 * A utility to handle and transform Sequelize-specific errors into
 * more user-friendly messages.
 * @param {object} error - The Sequelize error object to handle.
 * @returns {Error} A new, transformed Error object.
 */
function handleSequelizeError(error) {
  // Check if the error is a Sequelize error
  if (!error || !error.name) {
    return new Error('An unexpected error occurred.', { cause: error });
  }

  switch (error.name) {
    case 'SequelizeUniqueConstraintError':
      // Extract the field that caused the unique constraint violation
      const uniqueField = error.errors && error.errors[0] ? error.errors[0].path : 'unknown field';
      return new Error(`A duplicate value exists for the field: ${uniqueField}.`, { cause: error });
    
    case 'SequelizeForeignKeyConstraintError':
        // Extract the specific column from the detailed message
        const match = error.parent?.detail?.match(/\((.*?)\)/);
        const foreignKeyField = match ? match[1].replace('_id', '') : 'unknown field';
        return new Error(`The provided ${foreignKeyField} does not exist.`, { cause: error });

    case 'SequelizeValidationError':
      // This case is for model-level validation errors (e.g., notNull, isIn)
      const validationError = error.errors && error.errors[0] ? error.errors[0].message : 'Validation error';
      return new Error(validationError, { cause: error });

    default:
      // Return a generic error for any other unhandled Sequelize error
      return new Error(`Database error: ${error.message}`, { cause: error });
  }
}

/**
 * Handles multiple Sequelize errors, returning an array of transformed errors.
 * This function ensures all errors are returned in a consistent, user-friendly format.
 * @param {object} error - The Sequelize error object.
 * @returns {Array<object>} An array of objects, each containing a field and message.
 */
function handleAllErrors(error) {
  if (error.name === 'SequelizeValidationError' && error.errors && error.errors.length > 0) {
    return error.errors.map(err => ({
      field: err.path,
      message: err.message,
    }));
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors && error.errors[0] ? error.errors[0].path : 'general';
    return [{ field, message: `A duplicate value exists for the field: ${field}.` }];
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    const match = error.parent?.detail?.match(/\((.*?)\)/);
    const foreignKeyField = match ? match[1].replace('_id', '') : 'general';
    return [{ field: foreignKeyField, message: `The provided ${foreignKeyField} does not exist.` }];
  }
  
  // Fallback for any other unexpected errors
  return [{ field: 'general', message: `An unexpected error occurred: ${error.message}` }];
}

module.exports = { handleSequelizeError, handleAllErrors };
