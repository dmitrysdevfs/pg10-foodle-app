import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchRecipes as fetchRecipesAPI,
  fetchCategories,
  fetchIngredients,
  createRecipe as createRecipeAPI,
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

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const data = await createRecipeAPI(recipeData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to create recipe'
      );
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
      })
      .addCase(createRecipe.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add the new recipe to the beginning of the list
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase('auth/logOut/fulfilled', () => initialState);
  },
});

export const { setSearchQuery, setFilters, clearRecipes, resetError } =
  recipesSlice.actions;

export default recipesSlice.reducer;
