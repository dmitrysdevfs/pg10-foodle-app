import { createSlice } from '@reduxjs/toolkit';
import { logIn, logOut, refreshUser, register } from './operations';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: null,
      email: null,
    },
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    refreshing: false,
  },

  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },

  extraReducers: builder =>
    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(logIn.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logOut.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, state => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
        state.refreshing = false;

        try {
          localStorage.removeItem('persist:auth');
          localStorage.removeItem('persist:recipes');
        } catch (error) {
          console.warn('Error clearing localStorage:', error);
        }
      })
      .addCase(logOut.rejected, state => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
        state.refreshing = false;

        try {
          localStorage.removeItem('persist:auth');
          localStorage.removeItem('persist:recipes');
        } catch (error) {
          console.warn('Error clearing localStorage:', error);
        }
      })
      .addCase(refreshUser.pending, state => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token || state.token;
        state.refreshing = false;
        state.isLoggedIn = true;
      })
      .addCase(refreshUser.rejected, state => {
        state.refreshing = false;
        state.user = { name: null, email: null };
        state.isLoggedIn = false;
      }),
});

export const { clearError, updateToken } = authSlice.actions;

export default authSlice.reducer;
