import RecipeCard from '../RecipeCard/RecipeCard';
import css from './RecipesList.module.css';

export default function RecipesList({ recipes }) {
  console.log('Recipes: ', recipes);

  if (!recipes?.length) {
    return (
      <p className={css.message}>There are currently no recipes available.</p>
    );
  }

  return (
    <ul className={css.list}>
      {recipes.map(recipe => (
        <li key={recipe._id} className={css.item}>
          <RecipeCard recipe={recipe} recipes={recipes} recipeId={recipe._id} />
        </li>
      ))}
    </ul>
  );
}
