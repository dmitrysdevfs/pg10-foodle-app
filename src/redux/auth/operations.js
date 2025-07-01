import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} from '../authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());

      const response = await axios.post('/api/auth/login', credentials);
      const { user, token } = response.data;

      // Set token in axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch(loginSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch }) => {
    try {
      dispatch(registerStart());

      const response = await axios.post('/api/auth/register', userData);
      const { user, token } = response.data;

      // Set token in axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch(registerSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);
