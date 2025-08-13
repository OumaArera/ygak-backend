const multer = require('multer');
const fs = require('fs');

// Ensure the upload directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

function createDiskUploadMiddleware(options = {}) {
  const {
    destination = 'uploads',
    allowedMimeTypes = [],
    maxFileSizeMB = 200,
    fields = []
  } = options;

  ensureDirExists(destination);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.length === 0 || allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 }
  });

  return fields.length > 0 ? upload.fields(fields) : upload.any();
}

// Create a generic middleware instance (reusable)
const fileUploadMiddleware = (fields = []) =>
  createDiskUploadMiddleware({
    destination: 'uploads',
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    maxFileSizeMB: 200,
    fields
  });

module.exports = fileUploadMiddleware;
