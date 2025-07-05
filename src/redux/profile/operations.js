import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthHeader } from '../auth/operations.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

export const fetchOwnRecipes = createAsyncThunk(
  'profile/fetchOwnRecipes',
  async (page = 1, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No auth token');
      }

      setAuthHeader(`Bearer ${token}`);

      const res = await axios.get(`/api/recipes/own?page=${page}&perPage=12`);

      console.log('API response:', res.data);
      return {
        recipes: res.data.recipes,
        hasMore: res.data.hasMore,
        page,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFavoriteRecipes = createAsyncThunk(
  'profile/fetchFavoriteRecipes',
  async (page = 1, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No auth token');
      }

      setAuthHeader(`Bearer ${token}`);

      const response = await axios.get(`/api/recipes/favorite?page=${page}`);
      return {
        recipes: response.data.recipes,
        hasMore: response.data.hasMore,
        page,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
