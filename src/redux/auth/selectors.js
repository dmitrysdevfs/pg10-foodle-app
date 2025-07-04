export const selectIsLoggedIn = state => state.auth.isLoggedIn;

export const selectUser = state => state.auth.user;

export const selectToken = state => state.auth.token;

export const selectLoading = state => state.auth.loading;

export const selectError = state => state.auth.error;

export const selectRefreshing = state => state.auth.refreshing;
