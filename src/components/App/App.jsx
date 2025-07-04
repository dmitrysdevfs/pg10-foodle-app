import css from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainPage from '../../pages/MainPage/MainPage';
import RecipeViewPage from '../../pages/RecipeViewPage/RecipeViewPage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import RecipeAddPage from '../../pages/RecipeAddPage/RecipeAddPage';

export default function App() {
  return (
    <div className={css.container}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-recipe" element={<RecipeAddPage />} />
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
