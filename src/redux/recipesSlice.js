import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRecipes as fetchRecipesAPI } from './recipes/operations';

// Async thunk для отримання рецептів
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

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  hasNextPage: false,
  currentPage: 1,
  searchQuery: '',
  filters: { category: '', ingredient: '' },
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearRecipes: (state) => {
      state.items = [];
      state.currentPage = 1;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
      });
  },
});

export const { setSearchQuery, setFilters, clearRecipes, resetError } = recipesSlice.actions;

// Селектори
export const selectRecipes = (state) => state.recipes.items;
export const selectIsLoading = (state) => state.recipes.isLoading;
export const selectError = (state) => state.recipes.error;
export const selectHasNextPage = (state) => state.recipes.hasNextPage;
export const selectCurrentPage = (state) => state.recipes.currentPage;
export const selectSearchQuery = (state) => state.recipes.searchQuery;
export const selectFilters = (state) => state.recipes.filters;
export const selectTotalItems = (state) => state.recipes.totalItems;

export default recipesSlice.reducer;
