/**
 * reservations.js — API helpers for reservation management (frontend).
 *
 * All routes except createReservation require an authenticated user (JWT
 * attached automatically by the axios interceptor in client.js).
 */
import api from './client';

/**
 * Create a new reservation for an accommodation.
 * The server computes totalCost from the accommodation's pricing fields.
 * @param {{ accommodation: string, checkIn: string, checkOut: string, guests: number }} data
 */
export const createReservation = (data) =>
  api.post('/reservations', data);

/**
 * Fetch all reservations made by the currently authenticated user.
 * @returns {Promise} resolves to { success, count, data: Reservation[] }
 */
export const getMyReservations = () =>
  api.get('/reservations/user');

/**
 * Fetch all reservations for listings owned by the authenticated host.
 * @returns {Promise} resolves to { success, count, data: Reservation[] }
 */
export const getHostReservations = () =>
  api.get('/reservations/host');

/**
 * Cancel and delete a reservation.
 * Allowed for: the user who booked, the listing's host, or an admin.
 * @param {string} id - The reservation's _id
 */
export const deleteReservation = (id) =>
  api.delete(`/reservations/${id}`);
