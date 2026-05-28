/**
 * Subscription service — API calls for subscription and payment endpoints.
 */

import api from './api';

const subscriptionService = {
  getConfig: async () => {
    const { data } = await api.get('/subscriptions/config/');
    return data;
  },

  getStatus: async () => {
    const { data } = await api.get('/subscriptions/status/');
    return data;
  },

  submitPayment: async (formData) => {
    const { data } = await api.post('/subscriptions/submit-payment/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getPaymentHistory: async () => {
    const { data } = await api.get('/subscriptions/payment-history/');
    return data;
  },

  getExportHistory: async () => {
    const { data } = await api.get('/subscriptions/export-history/');
    return data;
  },
};

export default subscriptionService;
