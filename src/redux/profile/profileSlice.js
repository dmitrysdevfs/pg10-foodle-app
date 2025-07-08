import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOwnRecipes,
  fetchFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
} from './operations';

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
      })

      .addCase(addToFavorites.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload;

        const alreadyExists = state.favoriteRecipes.some(r => r._id === id);
        if (!alreadyExists) {
          state.favoriteRecipes.push({ _id: id });
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(removeFromFavorites.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        const removedId = action.payload;
        state.favoriteRecipes = state.favoriteRecipes.filter(
          recipe => recipe._id !== removedId
        );
        state.favoriteTotalItems = state.favoriteTotalItems - 1;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase('auth/logOut/fulfilled', () => initialState);
  },
});

export default profileSlice.reducer;
