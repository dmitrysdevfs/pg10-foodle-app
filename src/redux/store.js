import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import recipesReducer from './recipes/recipesSlice';
import profileReducer from './profile/profileSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isLoggedIn'],
};

const recipesPersistConfig = {
  key: 'recipes',
  storage,
  whitelist: ['filters', 'searchQuery', 'categories', 'ingredients'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedRecipesReducer = persistReducer(
  recipesPersistConfig,
  recipesReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    recipes: persistedRecipesReducer,
    profile: profileReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
