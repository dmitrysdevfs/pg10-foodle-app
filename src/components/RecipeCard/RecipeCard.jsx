import css from './RecipeCard.module.css';
import RecipeList from '../RecipeLink/RecipeLink';
import SaveRecipeButton from '../SaveRecipeButton/SaveRecipeButton.jsx';

import { GoClock } from 'react-icons/go';

export default function RecipeCard({ recipe, recipes, recipeId, type }) {
  const { title, description, time, thumb, photo, calories } = recipe;
  {
    type === 'favorites' && console.log('proverka: favorites');
  }
  {
    type === 'own' && console.log('proverka: own');
  }

  return (
    <div className={css.item}>
      {(thumb || photo) && (
        <img
          src={thumb || photo}
          alt={title}
          className={css.image}
          onError={e => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <div className={css.titleContainer}>
        <h2 className={css.title}>{title}</h2>
        <div className={css.timeCont}>
          <p className={css.timeSvg}>
            <GoClock size={14.5} />
          </p>
          <p className={css.timeTitle}>{time}</p>
        </div>
      </div>
      <div className={css.descriptionContainer}>
        <p className={css.description}>{description}</p>
        <p className={css.calories}>~{calories || 'N/A'} cals</p>
      </div>
      <div className={css.buttonContainer}>
        <RecipeList recipes={recipes} recipeId={recipeId} />
        <SaveRecipeButton recipeId={recipeId} />
      </div>
    </div>
  );
}
