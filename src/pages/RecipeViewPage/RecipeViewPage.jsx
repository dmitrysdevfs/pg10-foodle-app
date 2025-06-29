import { useParams } from 'react-router-dom';

import css from './RecipeViewPage.module.css';

export default function RecipeViewPage() {
  const { id } = useParams();

  return (
    <div className={css.container}>
      <h1 className={css.title}>Recipe #{id}</h1>
      <div className={css.content}>
        <p>Detailed recipe information will be here</p>
        <p>Recipe ID: {id}</p>
      </div>
    </div>
  );
};
