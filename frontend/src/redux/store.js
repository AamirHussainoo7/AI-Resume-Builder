/**
 * Redux store configuration.
 * Combines auth and resume slices for global state management.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import resumeReducer from './resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
