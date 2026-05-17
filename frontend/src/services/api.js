/**
 * Axios API instance with JWT interceptors.
 * Handles automatic token attachment and refresh on 401 responses.
 */

import axios from 'axios';
import store from '../redux/store';
import { setTokens } from '../redux/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ---- Request Interceptor: Attach JWT ----
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.tokens?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor: Handle 401 + Token Refresh ----
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const refreshToken = state.auth.tokens?.refresh;

      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newTokens = {
          access: data.access,
          refresh: data.refresh || refreshToken,
        };

        store.dispatch(setTokens(newTokens));
        processQueue(null, data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state — force re-login
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
