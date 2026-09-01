/**
 * accommodations.js — API helpers for accommodation listings (frontend).
 *
 * All functions return the raw axios Promise so callers can handle
 * .then() / .catch() or use async/await.
 *
 * Image payloads:
 *   - Pass a plain JS object for URL-only listings (Content-Type: application/json).
 *   - Pass a FormData instance for file uploads; the Content-Type header is set
 *     automatically by axios so the multipart boundary is included correctly.
 */
import api from './client';

/**
 * Fetch all accommodation listings.
 * @param {Object} params - Optional query params, e.g. { location: 'New York' }
 */
export const getAccommodations = (params = {}) =>
  api.get('/accommodations', { params });

/**
 * Fetch a single accommodation by its MongoDB ObjectId.
 * @param {string} id - The accommodation's _id
 */
export const getAccommodationById = (id) =>
  api.get(`/accommodations/${id}`);

/**
 * Create a new accommodation listing.
 * @param {Object|FormData} data - Plain object (JSON) or FormData (file upload)
 */
export const createAccommodation = (data) => {
  const isFormData = data instanceof FormData;
  return api.post('/accommodations', data, {
    // Only override Content-Type for FormData; axios handles the boundary
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

/**
 * Update an existing accommodation listing.
 * @param {string} id - The accommodation's _id
 * @param {Object|FormData} data - Fields to update
 */
export const updateAccommodation = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/accommodations/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

/**
 * Permanently delete an accommodation listing.
 * @param {string} id - The accommodation's _id
 */
export const deleteAccommodation = (id) =>
  api.delete(`/accommodations/${id}`);
