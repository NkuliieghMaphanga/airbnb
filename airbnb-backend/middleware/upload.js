/**
 * upload.js — Multer middleware for handling image file uploads.
 *
 * Files are saved to /uploads/ with a timestamp-based unique filename.
 * The backend serves this directory statically at /uploads/* (see server.js).
 *
 * Constraints:
 *   - Allowed types: JPEG, JPG, PNG, WebP
 *   - Max file size: 5 MB per file
 *
 * Usage (in routes):
 *   upload.array('images', 10)   — accept up to 10 images
 *   upload.single('image')       — accept a single image
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }
  cb(new Error('Only .jpeg, .jpg, .png and .webp image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

module.exports = upload;
