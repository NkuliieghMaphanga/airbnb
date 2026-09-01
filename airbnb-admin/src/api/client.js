/**
 * client.js — pre-configured axios instance for the Admin Portal.
 *
 * Base URL: resolves from VITE_API_URL env variable, falling back to '/api'
 * which is proxied to http://localhost:5000 by the Vite dev server.
 *
 * Request interceptor:
 *   Reads the admin JWT from localStorage and attaches it as a Bearer token
 *   on every outgoing request.  The token key ('admin_token') is separate
 *   from the frontend app's key to avoid cross-app collisions.
 *
 * Response interceptor:
 *   Handles 401 Unauthorized responses globally.  If the server rejects the
 *   token mid-session (expired, revoked, or tampered), the stored token is
 *   cleared and the user is redirected to /login so they can re-authenticate
 *   rather than seeing confusing permission-denied errors on every page.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// ── Request interceptor — attach stored admin JWT ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — handle token expiry globally ───────────────────────
api.interceptors.response.use(
  // Pass through successful responses unchanged
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Token is missing, expired, or invalid — clear it and redirect to login.
      // Using window.location instead of navigate() because this module lives
      // outside the React component tree and has no access to the router context.
      localStorage.removeItem('admin_token');

      // Only redirect if not already on the login page (avoids redirect loops)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
