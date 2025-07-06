import css from './RecipeCard.module.css';
import RecipeList from '../RecipeLink/RecipeLink';

import { GoClock } from 'react-icons/go';
import { CiBookmark } from 'react-icons/ci';

export default function RecipeCard({ recipe, recipes, recipeId }) {
  const { title, description, time, thumb, calories } = recipe;

  return (
    <div className={css.item}>
      <img src={thumb} alt={title} className={css.image} />
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
        <button className={css.savedBtn}>
          <CiBookmark size={24} />
        </button>
      </div>
    </div>
  );
}
