import api from './client';

export const createReservation = (data) => api.post('/reservations', data);
export const getMyReservations = () => api.get('/reservations/user');
export const getHostReservations = () => api.get('/reservations/host');
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);
