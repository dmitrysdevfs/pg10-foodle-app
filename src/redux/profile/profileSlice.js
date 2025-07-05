import { createSlice } from '@reduxjs/toolkit';
import { fetchOwnRecipes, fetchFavoriteRecipes } from './operations';

const initialState = {
  ownRecipes: [],
  favoriteRecipes: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOwnRecipes.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnRecipes.fulfilled, (state, action) => {
        const { recipes, hasMore, page } = action.payload;
        state.isLoading = false;
        state.ownRecipes =
          page === 1 ? recipes : [...state.ownRecipes, ...recipes];
        state.hasMore = hasMore;
        state.page = page;
      })
      .addCase(fetchOwnRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchFavoriteRecipes.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        const { recipes, hasMore, page } = action.payload;
        state.isLoading = false;
        state.favoriteRecipes =
          page === 1 ? recipes : [...state.favoriteRecipes, ...recipes];
        state.hasMore = hasMore;
        state.page = page;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;
