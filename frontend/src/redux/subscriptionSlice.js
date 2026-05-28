/**
 * Subscription slice — Manages subscription status and payment state.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionService from '../services/subscriptionService';

const initialState = {
  status: null,       // { is_premium, plan, days_remaining, free_exports_remaining, ... }
  paymentHistory: [],
  exportHistory: [],
  config: null,       // { upi_id, price, duration_days, ... }
  isLoading: false,
  error: null,
};

// ---- Async Thunks ----

export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getStatus();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch subscription status.');
    }
  }
);

export const fetchPaymentConfig = createAsyncThunk(
  'subscription/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getConfig();
    } catch (error) {
      return rejectWithValue('Failed to fetch payment config.');
    }
  }
);

export const submitPayment = createAsyncThunk(
  'subscription/submitPayment',
  async (formData, { rejectWithValue }) => {
    try {
      return await subscriptionService.submitPayment(formData);
    } catch (error) {
      const msg = error.response?.data?.error
        || error.response?.data?.transaction_id?.[0]
        || 'Payment submission failed.';
      return rejectWithValue(msg);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'subscription/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await subscriptionService.getPaymentHistory();
      return data.results || data;
    } catch (error) {
      return rejectWithValue('Failed to fetch payment history.');
    }
  }
);

export const fetchExportHistory = createAsyncThunk(
  'subscription/fetchExportHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await subscriptionService.getExportHistory();
      return data.results || data;
    } catch (error) {
      return rejectWithValue('Failed to fetch export history.');
    }
  }
);

// ---- Slice ----

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch config
      .addCase(fetchPaymentConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      // Submit payment
      .addCase(submitPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitPayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Payment history
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
      })
      // Export history
      .addCase(fetchExportHistory.fulfilled, (state, action) => {
        state.exportHistory = action.payload;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
