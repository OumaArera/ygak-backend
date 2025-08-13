const multer = require('multer');

/**
 * Create a reusable file upload middleware optimized for performance
 * @param {Object} options
 * @param {string[]} [options.allowedMimeTypes] - Allowed MIME types (empty = allow all)
 * @param {number} [options.maxFileSizeMB] - Maximum file size in MB
 * @param {Array} [options.fields] - Multer fields definition
 */
function createUploadMiddleware(options = {}) {
  const {
    allowedMimeTypes = [],
    maxFileSizeMB = 10,
    fields = []
  } = options;

  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.length === 0 || allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { 
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: 10,
      fields: 20,
    }
  });

  return fields.length > 0 ? upload.fields(fields) : upload.any();
}

// Specific middleware for budget files with proper field configuration
const budgetUploadMiddleware = createUploadMiddleware({
  allowedMimeTypes: [
    'application/pdf', 
    'image/jpeg', 
    'image/jpg', 
    'image/png'
  ],
  maxFileSizeMB: 10,
  fields: [
    { name: 'invoice', maxCount: 1 },
    { name: 'receipt', maxCount: 1 }
  ]
});

module.exports = budgetUploadMiddleware;