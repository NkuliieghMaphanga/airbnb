import api from './client';

/**
 * Fetch accommodation listings.
 *
 * Default behaviour:
 * - No location = ALL locations
 * - "all" = ALL locations
 * - Specific location = filter by that location
 */
export const getAccommodations = (params = {}) => {
  const location = params.location?.trim();

  // ALL LOCATIONS is the default
  if (!location || location.toLowerCase() === 'all') {
    return api.get('/accommodations');
  }

  // Specific location
  return api.get('/accommodations', {
    params: { location },
  });
};

/**
 * Fetch a single accommodation by its MongoDB ObjectId.
 */
export const getAccommodationById = (id) =>
  api.get(`/accommodations/${id}`);

/**
 * Create a new accommodation listing.
 */
export const createAccommodation = (data) => {
  // Do not set Content-Type for FormData — axios adds the boundary automatically
  return api.post('/accommodations', data);
};

/**
 * Update an existing accommodation listing.
 */
export const updateAccommodation = (id, data) => {
  return api.put(`/accommodations/${id}`, data);
};

/**
 * Permanently delete an accommodation listing.
 */
export const deleteAccommodation = (id) =>
  api.delete(`/accommodations/${id}`);