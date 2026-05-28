/**
 * Redux store — Combines all reducers.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import resumeReducer from './resumeSlice';
import subscriptionReducer from './subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    subscription: subscriptionReducer,
  },
});

export default store;
