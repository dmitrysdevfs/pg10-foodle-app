import { createSlice } from '@reduxjs/toolkit';
import { fetchOwnRecipes, fetchFavoriteRecipes } from './operations';

const initialState = {
  ownRecipes: [],
  favoriteRecipes: [],
  ownPage: 1,
  favoritePage: 1,
  ownHasMore: false,
  favoriteHasMore: false,
  ownTotalItems: 0,
  favoriteTotalItems: 0,
  isLoading: false,
  error: null,
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
        const { recipes, hasMore, page, totalItems } = action.payload;
        state.isLoading = false;
        state.ownRecipes =
          page === 1 ? recipes : [...state.ownRecipes, ...recipes];
        state.ownHasMore = hasMore;
        state.ownPage = page;
        state.ownTotalItems = totalItems;
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
        const { recipes, hasMore, page, totalItems } = action.payload;
        state.isLoading = false;
        state.favoriteRecipes =
          page === 1 ? recipes : [...state.favoriteRecipes, ...recipes];
        state.favoriteHasMore = hasMore;
        state.favoritePage = page;
        state.favoriteTotalItems = totalItems;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;
