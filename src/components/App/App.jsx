import css from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage';
import RecipeViewPage from '../../pages/RecipeViewPage/RecipeViewPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import RegisterPage from '../../pages/RegisterPage/RegisterPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Layout from '../Layout/Layout.jsx';

export default function App() {
  return (
    <div className={css.container}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/recipe/:id" element={<RecipeViewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}
