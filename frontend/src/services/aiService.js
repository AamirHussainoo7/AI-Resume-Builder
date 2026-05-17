/**
 * AI service — API calls for AI-powered resume features.
 */

import api from './api';

const aiService = {
  improveText: async (text, context = '', resumeId = null) => {
    const { data } = await api.post('/ai/improve/', {
      text,
      context,
      resume_id: resumeId,
    });
    return data;
  },

  getATSScore: async (resumeId) => {
    const { data } = await api.post('/ai/ats-score/', {
      resume_id: resumeId,
    });
    return data;
  },

  generateSummary: async (resumeId) => {
    const { data } = await api.post('/ai/generate-summary/', {
      resume_id: resumeId,
    });
    return data;
  },
};

export default aiService;
