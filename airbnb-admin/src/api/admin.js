import api from './client';

// Stats
export const getStats = () => api.get('/admin/stats');

// Users
export const getAllUsers = () => api.get('/admin/users');
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Reservations
export const getAllReservations = () => api.get('/admin/reservations');
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// Accommodations (uses regular routes — admin role is accepted by existing authorize middleware)
export const getAllAccommodations = () => api.get('/accommodations');
export const getAccommodationById = (id) => api.get(`/accommodations/${id}`);
export const createAccommodation = (formData) =>
  api.post('/accommodations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAccommodation = (id, formData) =>
  api.put(`/accommodations/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAccommodation = (id) => api.delete(`/accommodations/${id}`);
