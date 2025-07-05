export const selectOwnRecipes = state => state.profile.ownRecipes;
export const selectFavoriteRecipes = state => state.profile.favoriteRecipes;
export const selectLoading = state => state.profile.isLoading;
export const selectError = state => state.profile.error;
export const selectHasMore = state => state.profile.hasMore;
export const selectPage = state => state.profile.page;
