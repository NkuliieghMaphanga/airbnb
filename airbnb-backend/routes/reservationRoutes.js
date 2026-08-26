/**
 * Reservation Routes
 *
 * Base path: /api/reservations
 *
 * POST   /api/reservations        — Create a reservation (private: any authenticated user)
 * GET    /api/reservations/user   — Get the current user's reservations (private)
 * GET    /api/reservations/host   — Get reservations for the host's listings (private: host/admin)
 * DELETE /api/reservations/:id    — Cancel/delete a reservation (private: booker, host, or admin)
 *
 * Cost calculation is performed server-side using the accommodation's pricing fields:
 *   totalCost = (nights × price) − weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes
 */
const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

// @route   POST /api/reservations
// @desc    Create a new reservation; computes totalCost server-side
// @access  Private — any authenticated user
router.post('/', protect, createReservation);

// @route   GET /api/reservations/host
// @desc    Return all reservations for listings owned by the current user
// @access  Private — host or admin role expected
router.get('/host', protect, getReservationsByHost);

// @route   GET /api/reservations/user
// @desc    Return all reservations made by the current user
// @access  Private
router.get('/user', protect, getReservationsByUser);

// @route   DELETE /api/reservations/:id
// @desc    Cancel and delete a reservation (authorised: booker, host, or admin)
// @access  Private
router.delete('/:id', protect, deleteReservation);

module.exports = router;
