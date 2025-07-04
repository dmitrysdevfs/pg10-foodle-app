import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchRecipes as fetchRecipesAPI,
  fetchCategories,
  fetchIngredients,
} from './operations';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchRecipesAPI(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  'recipes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchIngredientsAsync = createAsyncThunk(
  'recipes/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchIngredients();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ingredients');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  hasNextPage: false,
  currentPage: 1,
  searchQuery: '',
  filters: { category: '', ingredient: '' },
  categories: [],
  ingredients: [],
  filtersLoading: false,
  filtersError: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.totalItems = 0;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.totalItems = 0;
    },
    clearRecipes: state => {
      state.items = [];
      state.currentPage = 1;
    },
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRecipes.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.totalItems = 0;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, page, hasNextPage, totalItems } = action.payload;

        if (page === 1) {
          state.items = data;
        } else {
          state.items = [...state.items, ...data];
        }

        state.currentPage = page;
        state.hasNextPage = hasNextPage;
        state.totalItems = totalItems;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, state => {
        state.filtersLoading = true;
        state.filtersError = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
        state.categories = [];
      })
      .addCase(fetchIngredientsAsync.pending, state => {
        state.filtersLoading = true;
        state.filtersError = null;
      })
      .addCase(fetchIngredientsAsync.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.ingredients = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchIngredientsAsync.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError = action.payload;
        state.ingredients = [];
      });
  },
});

export const { setSearchQuery, setFilters, clearRecipes, resetError } =
  recipesSlice.actions;

export const selectRecipes = state => state.recipes.items;
export const selectIsLoading = state => state.recipes.isLoading;
export const selectError = state => state.recipes.error;
export const selectHasNextPage = state => state.recipes.hasNextPage;
export const selectCurrentPage = state => state.recipes.currentPage;
export const selectSearchQuery = state => state.recipes.searchQuery;
export const selectFilters = state => state.recipes.filters;
export const selectTotalItems = state => state.recipes.totalItems;
export const selectCategories = state => state.recipes.categories;
export const selectIngredients = state => state.recipes.ingredients;
export const selectFiltersLoading = state => state.recipes.filtersLoading;
export const selectFiltersError = state => state.recipes.filtersError;

export default recipesSlice.reducer;
