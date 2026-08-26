import api from './client';

export const loginRequest = (email, password) => api.post('/users/login', { email, password });
export const registerRequest = (payload) => api.post('/users/register', payload);
export const getMeRequest = () => api.get('/users/me');
