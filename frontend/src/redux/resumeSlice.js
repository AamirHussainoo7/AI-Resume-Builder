/**
 * Resume slice — Manages resume list and current resume state.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../services/resumeService';

const initialState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

// ---- Async Thunks ----

export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await resumeService.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch resumes.');
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resume/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await resumeService.getById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch resume.');
    }
  }
);

export const createResume = createAsyncThunk(
  'resume/create',
  async (data, { rejectWithValue }) => {
    try {
      return await resumeService.create(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create resume.');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await resumeService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update resume.');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, { rejectWithValue }) => {
    try {
      await resumeService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete resume.');
    }
  }
);

// ---- Slice ----

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    updateCurrentResumeField: (state, action) => {
      if (state.currentResume) {
        const { field, value } = action.payload;
        state.currentResume[field] = value;
      }
    },
    clearResumeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload.results || action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchResumeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createResume.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isSaving = false;
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateResume.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentResume = action.payload;
        const index = state.resumes.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
        if (state.currentResume?.id === action.payload) {
          state.currentResume = null;
        }
      });
  },
});

export const {
  clearCurrentResume,
  setCurrentResume,
  updateCurrentResumeField,
  clearResumeError,
} = resumeSlice.actions;

export default resumeSlice.reducer;
