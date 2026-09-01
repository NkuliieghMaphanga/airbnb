/**
 * Reservation Routes
 *
 * Base path: /api/reservations
 *
 * POST    /api/reservations         — Create a reservation (private: any authenticated user)
 * GET     /api/reservations/user    — Get the current user's reservations (private)
 * GET     /api/reservations/host    — Get reservations for the host's listings (private)
 * GET     /api/reservations/:id     — Get a single reservation by ID (private)
 * PATCH   /api/reservations/:id/status — Update reservation status (private: host/admin)
 * DELETE  /api/reservations/:id     — Cancel/delete a reservation (private: booker, host, or admin)
 *
 * Cost calculation is performed server-side using the accommodation's pricing fields:
 *   totalCost = (nights × price) − weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes
 */
const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservationById,
  getReservationsByHost,
  getReservationsByUser,
  updateReservationStatus,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/reservations
// @desc    Create a new reservation; computes totalCost server-side
// @access  Private — any authenticated user
router.post('/', protect, createReservation);

// @route   GET /api/reservations/host
// @desc    Return all reservations for listings owned by the current user
// @access  Private — host or admin
router.get('/host', protect, authorize('host', 'admin'), getReservationsByHost);

// @route   GET /api/reservations/user
// @desc    Return all reservations made by the current user
// @access  Private
router.get('/user', protect, getReservationsByUser);

// @route   GET /api/reservations/:id
// @desc    Return a single reservation by its MongoDB ObjectId
// @access  Private — booker, host, or admin
router.get('/:id', protect, getReservationById);

// @route   PATCH /api/reservations/:id/status
// @desc    Update a reservation's status (confirmed → completed / cancelled)
// @access  Private — host or admin
router.patch('/:id/status', protect, authorize('host', 'admin'), updateReservationStatus);

// @route   DELETE /api/reservations/:id
// @desc    Cancel and permanently delete a reservation
// @access  Private — booker, host, or admin
router.delete('/:id', protect, deleteReservation);

module.exports = router;
