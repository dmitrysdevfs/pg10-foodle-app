import { useNavigate } from 'react-router-dom';
import css from './RecipesList.module.css';

export default function RecipesList({ recipes, type, onRemoveFavorite }) {
  const navigate = useNavigate();
  console.log('Recipes: ', recipes);

  if (!recipes?.length) {
    return (
      <p className={css.message}>There are currently no recipes available.</p>
    );
  }

  const handleRecipeClick = recipeId => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleRemoveClick = (e, recipeId) => {
    e.stopPropagation();
    onRemoveFavorite?.(recipeId);
  };

  return (
    <ul className={css.list}>
      {recipes.map(recipe => (
        <li
          key={recipe._id}
          className={css.item}
          onClick={() => handleRecipeClick(recipe._id)}
        >
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>

          {type === 'favorites' && (
            <button
              className={css.removeBtn}
              onClick={e => handleRemoveClick(e, recipe._id)}
            >
              ❌ Remove from favorites
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
