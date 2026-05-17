/**
 * Resume service — API calls for resume CRUD operations.
 */

import api from './api';

const resumeService = {
  getAll: async () => {
    const { data } = await api.get('/resumes/');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/resumes/${id}/`);
    return data;
  },

  create: async (resumeData) => {
    const { data } = await api.post('/resumes/', resumeData);
    return data;
  },

  update: async (id, resumeData) => {
    const { data } = await api.put(`/resumes/${id}/`, resumeData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/resumes/${id}/`);
    return data;
  },
};

export default resumeService;
