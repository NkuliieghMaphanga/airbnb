/**
 * Accommodation Routes
 *
 * Base path: /api/accommodations
 *
 * GET    /api/accommodations          — List all listings (public, optional ?location= filter)
 * GET    /api/accommodations/:id      — Get a single listing by ID (public)
 * POST   /api/accommodations          — Create a new listing (private: host/admin)
 * PUT    /api/accommodations/:id      — Update an existing listing (private: owner host/admin)
 * DELETE /api/accommodations/:id      — Delete a listing (private: owner host/admin)
 *
 * Image handling: accepts multipart/form-data with "images" file field (multer),
 * OR a JSON body with an "images" array of URL strings.
 */
const express = require('express');
const router = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Middleware that only runs multer when the request is multipart/form-data.
// JSON requests pass through untouched so express.json() handles them normally.
const optionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.array('images', 10)(req, res, next);
  }
  next();
};

// ── Public routes ──────────────────────────────────────────
// @route   GET /api/accommodations
// @desc    Return all listings; filter by ?location=<string> (case-insensitive regex)
// @access  Public
router.get('/', getAccommodations);

// @route   GET /api/accommodations/:id
// @desc    Return a single listing by MongoDB ObjectId
// @access  Public
router.get('/:id', getAccommodationById);

// ── Private routes (host or admin) ────────────────────────
// @route   POST /api/accommodations
// @desc    Create a new accommodation listing
// @access  Private — host or admin role required
router.post('/', protect, authorize('host', 'admin'), optionalUpload, createAccommodation);

// @route   PUT /api/accommodations/:id
// @desc    Update an accommodation listing (owner host or admin only)
// @access  Private — host (own listing) or admin role required
router.put('/:id', protect, authorize('host', 'admin'), optionalUpload, updateAccommodation);

// @route   DELETE /api/accommodations/:id
// @desc    Permanently delete an accommodation listing
// @access  Private — host (own listing) or admin role required
router.delete('/:id', protect, authorize('host', 'admin'), deleteAccommodation);

module.exports = router;
