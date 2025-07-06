import { useParams } from 'react-router-dom';

import css from './AddRecipePage.module.css';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';

export default function AddRecipePage() {
  const { id } = useParams();

  return (
    <div className={css.container}>
      <h2 className={css.title}> {id ? `Edit Recipe ${id}` : 'Add Recipe'}</h2>
      <AddRecipeForm/>
    </div>
  );
} 

