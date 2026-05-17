/**
 * Auth slice — Manages authentication state, user data, and JWT tokens.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Retrieve tokens from localStorage on app start
const tokens = JSON.parse(localStorage.getItem('tokens'));
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  tokens: tokens || null,
  isAuthenticated: !!tokens,
  isLoading: false,
  error: null,
};

// ---- Async Thunks ----

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        'Registration failed. Please try again.'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Invalid email or password.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const { tokens } = getState().auth;
    try {
      if (tokens?.refresh) {
        await authService.logout(tokens.refresh);
      }
    } catch {
      // Ignore logout API errors — clear local state regardless
    }
    authService.clearStorage();
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Profile update failed.'
      );
    }
  }
);

// ---- Slice ----

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('tokens', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        localStorage.setItem('tokens', JSON.stringify(action.payload.tokens));
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        localStorage.setItem('tokens', JSON.stringify(action.payload.tokens));
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
