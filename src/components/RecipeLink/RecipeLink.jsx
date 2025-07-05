import { Link, useLocation } from 'react-router-dom';

import css from './RecipeLink.module.css';

export default function RecipeList({ recipeId }) {
  const location = useLocation();

  return (
    <ul>
      <li>
        <Link
          to={`/recipes/${recipeId}`}
          state={{ from: location }}
          className={css.recipeLink}
        >
          Learn more
        </Link>
      </li>
    </ul>
  );
}
