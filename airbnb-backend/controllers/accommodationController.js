const Accommodation = require('../models/Accommodation');

/**
 * @route   POST /api/accommodations
 * @desc    Create a new accommodation listing
 * @access  Private (host/admin)
 */
const createAccommodation = async (req, res, next) => {
  try {
    const payload = { ...req.body, host: req.user._id };

    // Support file uploads (multer) OR image URL arrays sent as JSON body
    if (req.files && req.files.length > 0) {
      payload.images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      payload.images = req.body.images;
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

    res.status(200).json({ success: true, count: accommodations.length, data: accommodations });
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
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      updates.images = req.body.images;
    }

    const updated = await Accommodation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

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
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
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
