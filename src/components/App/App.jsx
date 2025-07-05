import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { refreshUser } from '../../redux/auth/operations';
import MainPage from '../../pages/MainPage/MainPage';
import RecipeViewPage from '../../pages/RecipeViewPage/RecipeViewPage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import RecipeAddPages from '../../pages/RecipeAddPage/RecipeAddPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Layout from '../Layout/Layout.jsx';
import css from './App.module.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <div className={css.container}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/recipes/:id" element={<RecipeViewPage />} />
          <Route path="/auth/:authType" element={<AuthPage />} />
          <Route path="/add-recipe" element={<RecipeAddPages />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: 'var(--dark-brown)',
            },
          },
          error: {
            style: {
              background: '#920505',
            },
          },
        }}
      />
    </div>
  );
}