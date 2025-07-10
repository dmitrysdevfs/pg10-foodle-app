import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOwnRecipes,
  fetchFavoriteRecipes,
  addToFavorites,
  removeFromFavorites,
  deleteOwnRecipe,
} from './operations';

const initialState = {
  ownRecipes: [],
  favoriteRecipes: [],
  ownPage: 1,
  favoritePage: 1,
  perPage: 12,
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
        state.ownRecipes = recipes;
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
        state.favoriteRecipes = recipes;
        state.favoriteHasMore = hasMore;
        state.favoritePage = page;
        state.favoriteTotalItems = totalItems;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addToFavorites.fulfilled, (state, action) => {
        const id = action.payload;

        const alreadyExists = state.favoriteRecipes.some(r => r._id === id);
        if (!alreadyExists) {
          state.favoriteRecipes.push({ _id: id });
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.favoriteRecipes = state.favoriteRecipes.filter(
          recipe => recipe._id !== removedId
        );
        state.favoriteTotalItems = state.favoriteTotalItems - 1;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase('auth/logOut/fulfilled', () => initialState)
      .addCase(deleteOwnRecipe.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOwnRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.ownRecipes = state.ownRecipes.filter(
          recipe => recipe._id !== deletedId
        );
        state.ownTotalItems = state.ownTotalItems - 1;
      })
      .addCase(deleteOwnRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;
