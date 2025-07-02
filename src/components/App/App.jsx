import css from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainPage from '../../pages/MainPage/MainPage';
import RecipeViewPage from '../../pages/RecipeViewPage/RecipeViewPage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Layout from '../Layout/Layout.jsx';

export default function App() {
  return (
    <div className={css.container}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/recipes/:id" element={<RecipeViewPage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
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
