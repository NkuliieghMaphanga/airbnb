import api from './client';

export const loginRequest = (email, password) => {
  return api.post('/users/login', {
    email: email.trim(),
    password,
  });
};

export const registerRequest = (payload) => {
  return api.post('/users/register', {
    username: payload.username.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role: payload.role,
  });
};

export const getMeRequest = () => {
  return api.get('/users/me');
};