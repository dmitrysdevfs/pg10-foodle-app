import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { refreshUser } from '../../redux/auth/operations';
import Loader from '../Loader/Loader';
import Layout from '../Layout/Layout';
import css from './App.module.css';
import { selectRefreshing, selectToken } from '../../redux/auth/selectors';
import RestrictedRoute from '../RestrictedRoute';
import PrivateRoute from '../RrivateRoute';
import SessionManager from '../SessionManager/SessionManager.jsx';

const MainPage = lazy(() => import('../../pages/MainPage/MainPage'));
const RecipeViewPage = lazy(() =>
  import('../../pages/RecipeViewPage/RecipeViewPage')
);
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage'));

const ProfilePage = lazy(() => import('../../pages/ProfilePage/ProfilePage'));
const ProfileOwnRecipes = lazy(() =>
  import('../../components/Profile/ProfileOwnRecipes')
);
const ProfileFavoriteRecipes = lazy(() =>
  import('../../components/Profile/ProfileFavoriteRecipes')
);

const AddRecipePage = lazy(() =>
  import('../../pages/AddRecipePage/AddRecipePage')
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
  const isRefreshing = useSelector(selectRefreshing);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      dispatch(refreshUser());
    }
  }, [dispatch, token]);

  return isRefreshing ? (
    <PageLoader />
  ) : (
    <div className={css.container}>
      <SessionManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="/recipes/:id" element={<RecipeViewPage />} />
            <Route
              path="/auth/:authType"
              element={<RestrictedRoute component={AuthPage} redirectTo="/" />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute component={ProfilePage} />}
            >
              <Route path="own" element={<ProfileOwnRecipes />} />
              <Route path="favorites" element={<ProfileFavoriteRecipes />} />
            </Route>
            <Route
              path="/add-recipe"
              element={<PrivateRoute component={AddRecipePage} />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
        gutter={8}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
    </div>
  );
}
