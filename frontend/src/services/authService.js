/**
 * Auth service — API calls for authentication endpoints.
 */

import api from './api';

const authService = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register/', userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials);
    return data;
  },

  logout: async (refreshToken) => {
    const { data } = await api.post('/auth/logout/', { refresh: refreshToken });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile/');
    return data;
  },

  updateProfile: async (profileData) => {
    const config = profileData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const { data } = await api.put('/auth/profile/', profileData, config);
    return data;
  },

  changePassword: async (passwordData) => {
    const { data } = await api.post('/auth/change-password/', passwordData);
    return data;
  },

  clearStorage: () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
  },
};

export default authService;
