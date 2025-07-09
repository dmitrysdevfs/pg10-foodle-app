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
      console.log('knopka', res);

      return {
        recipes: res.data.data.data,
        hasMore: res.data.data.hasNextPage,
        page: res.data.data.page,
        totalItems: res.data.data.totalItems,
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

      const res = await axios.get(
        `/api/recipes/favorite?page=${page}&perPage=12`
      );

      return {
        recipes: res.data.data.data,
        hasMore: res.data.data.hasNextPage,
        page: res.data.data.page,
        totalItems: res.data.data.totalItems,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'profile/addToFavorites',
  async (recipeId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No auth token');
      }

      setAuthHeader(`Bearer ${token}`);

      await axios.post(`/api/recipes/${recipeId}/favorite`);

      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'profile/removeFromFavorites',
  async (recipeId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No auth token');
      }

      setAuthHeader(`Bearer ${token}`);

      await axios.delete(`/api/recipes/${recipeId}/favorite`);

      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteOwnRecipe = createAsyncThunk(
  'profile/deleteOwnRecipe',
  async (recipeId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue('No auth token');
      }

      setAuthHeader(`Bearer ${token}`);

      await axios.delete(`/api/recipes/${recipeId}`);

      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
