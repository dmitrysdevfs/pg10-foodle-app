import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

const setAuthHeader = value => {
  axios.defaults.headers.common.Authorization = value;
};

const processAuthResponse = (data, credentials) => {
  const token = data?.accessToken;
  if (!token) throw new Error('No token found in response');

  const userData = data?.user || data?.data || data;

  const user = {
    email: userData.email || credentials.email,
    name: userData.name || credentials.name || 'User',
    avatar: userData.avatar || null,
    favorites: userData.favorites || [],
  };

  setAuthHeader(`Bearer ${token}`);
  return { token, user };
};

const performAuthRequest = async (url, credentials) => {
  const response = await axios.post(url, credentials);
  return processAuthResponse(response.data.data, credentials);
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      return await performAuthRequest('/api/auth/register', credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/logIn',
  async (credentials, thunkAPI) => {
    try {
      return await performAuthRequest('/api/auth/login', credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async () => {
  setAuthHeader('');

  try {
    localStorage.removeItem('persist:auth');
    localStorage.removeItem('persist:recipes');
  } catch {
    // Ignore errors
  }

  try {
    axios.post('/api/auth/logout').catch(() => {});
  } catch {
    // Ignore backend errors
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, thunkAPI) => {
    try {
      const reduxState = thunkAPI.getState();

      if (!reduxState.auth.token) {
        throw new Error('No token available');
      }

      setAuthHeader(`Bearer ${reduxState.auth.token}`);
      const response = await axios.get('/api/users/current');

      const userData = response.data.data || response.data;

      return {
        user: userData,
        token: reduxState.auth.token,
      };
    } catch (error) {
      setAuthHeader('');
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  },
  {
    condition: (_, thunkAPI) => {
      const reduxState = thunkAPI.getState();
      return reduxState.auth.token !== null;
    },
  }
);
