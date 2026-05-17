/**
 * Application constants.
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ResumeAI';

export const RESUME_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean two-column layout with colored sidebar',
    color: '#6366f1',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column with serif fonts',
    color: '#1a1a2e',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, whitespace-heavy design',
    color: '#64748b',
  },
];

export const EMPTY_RESUME = {
  title: 'Untitled Resume',
  template_name: 'modern',
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: '',
  skills: [],
  experiences: [],
  educations: [],
  projects: [],
};

export const EMPTY_EXPERIENCE = {
  company_name: '',
  role: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  order: 0,
};

export const EMPTY_EDUCATION = {
  college_name: '',
  degree: '',
  field_of_study: '',
  cgpa: '',
  start_year: '',
  end_year: '',
  order: 0,
};

export const EMPTY_PROJECT = {
  project_name: '',
  description: '',
  tech_stack: [],
  github_link: '',
  live_link: '',
  order: 0,
};
