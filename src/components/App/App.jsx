import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { refreshUser } from '../../redux/auth/operations';
import Loader from '../Loader/Loader';
import Layout from '../Layout/Layout';
import css from './App.module.css';

const MainPage = lazy(() => import('../../pages/MainPage/MainPage'));
const RecipeViewPage = lazy(() =>
  import('../../pages/RecipeViewPage/RecipeViewPage')
);
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage'));
const ProfilePage = lazy(() => import('../../pages/ProfilePage/ProfilePage'));
const ProfileOwnRecipes = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage')
);
const ProfileFavoriteRecipes = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage')
);
const RecipeAddPages = lazy(() =>
  import('../../pages/RecipeAddPage/RecipeAddPage')
);
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage')
);

const PageLoader = () => (
  <div className={css.pageLoader}>
    <Loader />
  </div>
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <div className={css.container}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="/recipes/:id" element={<RecipeViewPage />} />
            <Route path="/auth/:authType" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />}>
              <Route path="own" element={<ProfileOwnRecipes />} />
              <Route path="favorites" element={<ProfileFavoriteRecipes />} />
            </Route>
            <Route path="/add-recipe" element={<RecipeAddPages />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}
