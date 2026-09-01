/**
 * server.js — Express application entry point.
 *
 * Registers all global middleware, mounts route handlers, and starts the HTTP
 * server after the MongoDB connection is established.
 *
 * Security layers applied (in order):
 *   1. helmet      — sets secure HTTP response headers
 *   2. cors        — restricts cross-origin requests to CLIENT_URLS env var
 *   3. authLimiter — rate-limits auth endpoints to prevent brute force
 *   4. apiLimiter  — general rate-limit on all /api routes
 *   5. express.json — body parsing with 10kb size limit
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ── 1. Security headers ───────────────────────────────────────────────────────
// helmet sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security,
// X-XSS-Protection and more with sensible defaults.
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────────────────────────────────
// In production set CLIENT_URLS to a comma-separated list of allowed origins
// (e.g. "https://myapp.vercel.app,https://myadmin.vercel.app").
// If the variable is missing the server refuses all cross-origin requests in
// production and allows all in development.
const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      allowedOrigins.length > 0
        ? allowedOrigins
        : process.env.NODE_ENV === 'production'
        ? false  // block all cross-origin in production if CLIENT_URLS not set
        : '*',   // allow all in development
  })
);

// ── 3. Rate limiting ──────────────────────────────────────────────────────────
// Strict limiter for authentication endpoints — prevents brute-force attacks.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                    // max 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});

// General limiter for all other API routes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                   // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

// Apply auth limiter only to login/register endpoints
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Apply general limiter to all other API routes
app.use('/api', apiLimiter);

// ── 4. Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));          // reject oversized JSON bodies
app.use(express.urlencoded({ extended: true }));

// ── 5. Request logging (dev only) ────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── 6. Static files ───────────────────────────────────────────────────────────
// Serve uploaded images at /uploads/*
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── 7. Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// ── 8. Route handlers ─────────────────────────────────────────────────────────
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ── 9. Error handling (must be last) ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── 10. Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
