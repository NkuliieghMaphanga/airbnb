const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation for an accommodation
 * @access  Private
 */
const createReservation = async (req, res, next) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;

    if (!accommodationId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'accommodation, checkIn, checkOut and guests are all required',
      });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found' });
    }

    if (guests > accommodation.guests) {
      return res.status(400).json({
        success: false,
        message: `This listing only accommodates up to ${accommodation.guests} guests`,
      });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const subtotal = nights * accommodation.price;
    const discount = nights >= 7 ? subtotal * (accommodation.weeklyDiscount / 100) : 0;
    const totalCost =
      subtotal -
      discount +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user._id,
      host: accommodation.host,
      checkIn,
      checkOut,
      guests,
      totalCost,
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reservations/host
 * @desc    Get all reservations for listings owned by the authenticated host
 * @access  Private (host/admin)
 */
const getReservationsByHost = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reservations/user
 * @desc    Get all reservations made by the authenticated user
 * @access  Private
 */
const getReservationsByUser = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation', 'title location images price')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reservations/:id
 * @desc    Get a single reservation by its MongoDB ObjectId
 * @access  Private (the user who booked it, the host, or an admin)
 */
const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .populate('host', 'username email');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Only the guest who booked, the listing host, or an admin may view it
    const requesterId = req.user._id.toString();
    const isOwner = reservation.user?._id?.toString() === requesterId;
    const isHost = reservation.host?._id?.toString() === requesterId;

    if (!isOwner && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this reservation' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Update a reservation's status field
 * @access  Private (host who owns the listing, or admin)
 */
const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Only the listing host or an admin may change the status
    const isHost = reservation.host.toString() === req.user._id.toString();
    if (!isHost && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this reservation' });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete/cancel a reservation
 * @access  Private (the user who booked it, the host, or an admin)
 */
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const requesterId = req.user._id.toString();
    const isOwner = reservation.user.toString() === requesterId;
    const isHost = reservation.host.toString() === requesterId;

    if (!isOwner && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reservation' });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservationById,
  getReservationsByHost,
  getReservationsByUser,
  updateReservationStatus,
  deleteReservation,
};
