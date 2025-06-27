import css from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage/HomePage';
import RecipeViewPage from '../../pages/RecipeViewPage/RecipeViewPage';
import NotFound from '../../components/NotFound/NotFound';

export default function App() {
  return (
    <div className={css.container}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeViewPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
