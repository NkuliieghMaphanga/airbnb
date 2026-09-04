const Accommodation = require('../models/Accommodation');

/**
 * Normalize fields that arrive as strings when the request is multipart/form-data
 * (multer leaves text fields as strings). JSON bodies pass through unchanged.
 */
function normalizeAccommodationBody(body = {}) {
  const num = (v, fallback) => {
    if (v === undefined || v === null || v === '') return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const bool = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v === 'true' || v === '1' || v === 'on';
    return Boolean(v);
  };

  // Amenities may arrive as a single string (one checkbox) or an array
  let amenities = body.amenities;
  if (amenities === undefined || amenities === null) {
    amenities = [];
  } else if (typeof amenities === 'string') {
    amenities = amenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (!Array.isArray(amenities)) {
    amenities = [];
  }

  // Images as URL strings (JSON mode) — keep array; single string → array
  let images = body.images;
  if (typeof images === 'string' && images.trim()) {
    images = [images.trim()];
  } else if (!Array.isArray(images)) {
    images = undefined;
  }

  const normalized = {
    title: body.title !== undefined ? String(body.title).trim() : undefined,
    description: body.description !== undefined ? String(body.description).trim() : undefined,
    location: body.location !== undefined ? String(body.location).trim() : undefined,
    type: body.type !== undefined ? String(body.type).trim() : undefined,
    guests: body.guests !== undefined ? num(body.guests, 1) : undefined,
    bedrooms: body.bedrooms !== undefined ? num(body.bedrooms, 0) : undefined,
    bathrooms: body.bathrooms !== undefined ? num(body.bathrooms, 0) : undefined,
    price: body.price !== undefined ? num(body.price, 0) : undefined,
    weeklyDiscount: body.weeklyDiscount !== undefined ? num(body.weeklyDiscount, 0) : undefined,
    cleaningFee: body.cleaningFee !== undefined ? num(body.cleaningFee, 0) : undefined,
    serviceFee: body.serviceFee !== undefined ? num(body.serviceFee, 0) : undefined,
    occupancyTaxes: body.occupancyTaxes !== undefined ? num(body.occupancyTaxes, 0) : undefined,
    rating: body.rating !== undefined ? num(body.rating, 0) : undefined,
    reviews: body.reviews !== undefined ? num(body.reviews, 0) : undefined,
    enhancedCleaning: body.enhancedCleaning !== undefined ? bool(body.enhancedCleaning) : undefined,
    selfCheckIn: body.selfCheckIn !== undefined ? bool(body.selfCheckIn) : undefined,
    amenities,
  };

  if (images !== undefined) {
    normalized.images = images;
  }

  // Drop undefined keys so findByIdAndUpdate doesn't overwrite with undefined
  Object.keys(normalized).forEach((key) => {
    if (normalized[key] === undefined) delete normalized[key];
  });

  return normalized;
}

/**
 * @route   POST /api/accommodations
 * @desc    Create a new accommodation listing
 * @access  Private (host/admin)
 */
const createAccommodation = async (req, res, next) => {
  try {
    const payload = {
      ...normalizeAccommodationBody(req.body),
      host: req.user._id,
    };

    // File uploads (multer) take priority over image URL arrays
    if (req.files && req.files.length > 0) {
      payload.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    if (!payload.images || payload.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required (upload a file or provide image URLs).',
      });
    }

    const accommodation = await Accommodation.create(payload);
    res.status(201).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/accommodations
 * @desc    Get all accommodation listings, with optional filtering by location
 * @access  Public
 */
const getAccommodations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    const accommodations = await Accommodation.find(filter)
      .populate('host', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: accommodations.length,
      data: accommodations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/accommodations/:id
 * @desc    Get a single accommodation listing by id
 * @access  Public
 */
const getAccommodationById = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      'host',
      'username email role'
    );

    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }

    res.status(200).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/accommodations/:id
 * @desc    Update an accommodation listing
 * @access  Private (host who owns the listing, or admin)
 */
const updateAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }

    const isOwner = accommodation.host.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    const ALLOWED_FIELDS = [
      'title',
      'description',
      'location',
      'type',
      'guests',
      'bedrooms',
      'bathrooms',
      'amenities',
      'price',
      'weeklyDiscount',
      'cleaningFee',
      'serviceFee',
      'occupancyTaxes',
      'enhancedCleaning',
      'selfCheckIn',
      'rating',
      'reviews',
      'specificRatings',
      'images',
    ];

    const normalized = normalizeAccommodationBody(req.body);
    const updates = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (normalized[field] !== undefined) {
        updates[field] = normalized[field];
      }
    });

    // File upload takes priority over URL array
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updated = await Accommodation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('host', 'username email role');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/accommodations/:id
 * @desc    Delete an accommodation listing
 * @access  Private (host who owns the listing, or admin)
 */
const deleteAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }

    const isOwner = accommodation.host.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await accommodation.deleteOne();
    res.status(200).json({ success: true, message: 'Accommodation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
