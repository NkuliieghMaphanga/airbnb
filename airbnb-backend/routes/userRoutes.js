/**
 * User Routes
 *
 * Base path: /api/users
 *
 * POST   /api/users/register  — Register a new user (public)
 * POST   /api/users/login     — Authenticate user, return JWT (public)
 * GET    /api/users/me        — Get the current user's profile (private)
 */
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Register a new user and return a signed JWT
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate with email + password, return a signed JWT
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/me
// @desc    Return the profile of the currently authenticated user
// @access  Private — requires valid Bearer token
router.get('/me', protect, getMe);

module.exports = router;
