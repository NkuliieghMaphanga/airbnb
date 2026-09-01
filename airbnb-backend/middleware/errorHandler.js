/**
 * Handles requests to routes that don't exist.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Centralized error handler. Normalizes Mongoose validation/cast errors,
 * duplicate key errors, Multer file upload errors, and JWT errors into
 * consistent, informative JSON responses with appropriate HTTP status codes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details;

  // Mongoose validation error — extract per-field messages into details array
  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed';
  }

  // Mongoose bad ObjectId — e.g. /api/accommodations/not-a-valid-id
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  // Mongoose duplicate key error (unique index violation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate field value';
  }

  // Multer file upload errors — bad file type or size exceeded
  // These are thrown synchronously inside the middleware chain so they need
  // explicit handling here to return a 400 rather than a 500.
  if (err.name === 'MulterError') {
    statusCode = 400;
    // LIMIT_FILE_SIZE is the most common multer error
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum allowed size is 5 MB.'
        : `File upload error: ${err.message}`;
  }

  // Custom file-filter rejection from upload.js (wrong MIME type / extension)
  // The fileFilter calls cb(new Error('Only .jpeg...')) — detect by message prefix
  if (
    statusCode === 500 &&
    typeof err.message === 'string' &&
    err.message.startsWith('Only .jpeg')
  ) {
    statusCode = 400;
    message = err.message;
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = { notFound, errorHandler };
