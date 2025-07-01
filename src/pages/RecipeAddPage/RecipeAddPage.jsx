import { useParams } from 'react-router-dom';

import css from './RecipeAddPage.module.css';
import RecipeAddForm from '../../components/RecipeAddForm/RecipeAddForm';

export default function RecipeAddPage() {
  const { id } = useParams();

  return (
    <div className={css.container}>
      <h2 className={css.title}>Add Recipe{id}</h2>
      <RecipeAddForm/>
    </div>
  );
} 

