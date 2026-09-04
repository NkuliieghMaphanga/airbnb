/**
 * client.js — pre-configured axios instance for the Airbnb frontend.
 *
 * Base URL: `/api` — proxied to http://localhost:5000 by the Vite dev server
 * (see vite.config.js).  In production this should be set via VITE_API_URL.
 *
 * The request interceptor automatically reads the JWT from localStorage and
 * attaches it as a Bearer token on every outgoing request, so individual API
 * calls never need to handle auth headers manually.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// ── Request interceptor — attach stored JWT ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('airbnb_token');

    if (token) {
      // Attach the JWT so protected routes can verify the caller's identity
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
