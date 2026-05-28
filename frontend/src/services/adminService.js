/**
 * Admin service — API calls for admin portal endpoints.
 */

import api from './api';

const adminService = {
  login: async (credentials) => {
    const { data } = await api.post('/admin-portal/login/', credentials);
    return data;
  },

  getAnalytics: async () => {
    const { data } = await api.get('/admin-portal/analytics/');
    return data;
  },

  getPayments: async (params = {}) => {
    const { data } = await api.get('/admin-portal/payments/', { params });
    return data;
  },

  approvePayment: async (paymentId) => {
    const { data } = await api.post(`/admin-portal/payments/${paymentId}/approve/`);
    return data;
  },

  rejectPayment: async (paymentId, reason) => {
    const { data } = await api.post(`/admin-portal/payments/${paymentId}/reject/`, { reason });
    return data;
  },

  getUsers: async (params = {}) => {
    const { data } = await api.get('/admin-portal/users/', { params });
    return data;
  },

  extendSubscription: async (userId, days) => {
    const { data } = await api.post(`/admin-portal/users/${userId}/extend/`, { days });
    return data;
  },
};

export default adminService;
