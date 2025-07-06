export const selectOwnRecipes = state => state.profile.ownRecipes;
export const selectFavoriteRecipes = state => state.profile.favoriteRecipes;

export const selectOwnPage = state => state.profile.ownPage;
export const selectFavoritePage = state => state.profile.favoritePage;

export const selectOwnHasMore = state => state.profile.ownHasMore;
export const selectFavoriteHasMore = state => state.profile.favoriteHasMore;

export const selectOwnTotalItems = state => state.profile.ownTotalItems;
export const selectFavoriteTotalItems = state =>
  state.profile.favoriteTotalItems;

export const selectLoading = state => state.profile.isLoading;
export const selectError = state => state.profile.error;
