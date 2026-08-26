import api from './client';

export const getAccommodations = (params = {}) => api.get('/accommodations', { params });
export const getAccommodationById = (id) => api.get(`/accommodations/${id}`);

// Accepts a plain JS object (JSON) or FormData (file uploads)
export const createAccommodation = (data) => {
  const isFormData = data instanceof FormData;
  return api.post('/accommodations', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

export const updateAccommodation = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/accommodations/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

export const deleteAccommodation = (id) => api.delete(`/accommodations/${id}`);
