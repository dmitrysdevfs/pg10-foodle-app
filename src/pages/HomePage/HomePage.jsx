import { useRecipes } from '../../hooks/useRecipes';
import RecipesList from '../../components/RecipesList/RecipesList';

import css from './HomePage.module.css';

export default function HomePage() {
  const { recipes, isLoading, error } = useRecipes();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <>Error: {error}</>;

  return (
    <div className={css.container}>
      <h1 className={css.title}>PG10-Foodle 🍲</h1>
      <p className={css.subtitle}>All Recipes</p>
      <div className={css.content}>
        <RecipesList recipes={recipes} />
      </div>
    </div>
  );
}
