/**
 * admin.js — API helper functions for the Admin Portal.
 *
 * All requests are authenticated via the axios interceptor in client.js,
 * which automatically attaches the stored JWT as a Bearer token.
 */
import api from './client';

// ─── Stats ────────────────────────────────────────────────────────────────────
/** Fetch dashboard summary stats (users, accommodations, reservations, revenue). */
export const getStats = () => api.get('/admin/stats');

// ─── Users ────────────────────────────────────────────────────────────────────
/** List every registered user (admin only). */
export const getAllUsers = () => api.get('/admin/users');

/** Change a user's role. */
export const updateUserRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, { role });

/** Permanently delete a user account. */
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// ─── Reservations ─────────────────────────────────────────────────────────────
/** List every reservation across all listings (admin only). */
export const getAllReservations = () => api.get('/admin/reservations');

/** Cancel / delete a reservation by its id. */
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// ─── Accommodations ───────────────────────────────────────────────────────────
// Uses the standard /accommodations routes — the admin role is accepted by the
// existing authorize('host', 'admin') middleware on create/update/delete.

/** Fetch all accommodation listings. */
export const getAllAccommodations = () => api.get('/accommodations');

/** Fetch a single accommodation by id. */
export const getAccommodationById = (id) => api.get(`/accommodations/${id}`);

/**
 * Create a new accommodation listing.
 *
 * Accepts either a plain JS object (image URLs) or a FormData instance
 * (when the user selected a file to upload).  The Content-Type header is
 * intentionally omitted so axios sets it automatically — plain object →
 * application/json, FormData → multipart/form-data with the correct boundary.
 */
export const createAccommodation = (payload) =>
  api.post('/accommodations', payload);

/**
 * Update an existing accommodation listing.
 * Same plain-object / FormData handling as createAccommodation.
 */
export const updateAccommodation = (id, payload) =>
  api.put(`/accommodations/${id}`, payload);

/** Delete an accommodation listing. */
export const deleteAccommodation = (id) => api.delete(`/accommodations/${id}`);
