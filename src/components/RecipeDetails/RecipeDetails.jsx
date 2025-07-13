import styles from './RecipeDetails.module.css';
import SaveRecipeButton from '../SaveRecipeButton/SaveRecipeButton.jsx';
import NoPhoto from '../../assets/img/no_photo.jpg';
import DeleteRecipeButton from '../DeleteRecipeButton/DeleteRecipeButton.jsx';
import { selectUser, selectRefreshing, selectIsLoggedIn } from '../../redux/auth/selectors';
import { useSelector } from 'react-redux';

const RecipeDetails = ({ recipe }) => {
  const user = useSelector(selectUser);
  const isRefreshing = useSelector(selectRefreshing);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const ownerId =
    typeof recipe.owner === 'object' ? recipe.owner._id : recipe.owner;
  const isOwner = user?._id === ownerId && !isRefreshing && isLoggedIn && user?._id;

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.topSection}>
        <h2 className={styles.title}>{recipe.title}</h2>
        <div className={styles.imgContainer}>
          {recipe.thumb || recipe.photo ? (
            <img
              src={recipe.thumb || recipe.photo}
              alt={recipe.title}
              className={styles.image}
              onError={e => {
                e.target.src = NoPhoto;
                e.target.alt = 'Recipe image not available';
              }}
            />
          ) : (
            <img
              src={NoPhoto}
              alt="Recipe image not available"
              className={styles.image}
            />
          )}
        </div>
      </div>

      <div className={styles.layoutWrapper}>
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>About recipe</h3>
            <p>{recipe.description}</p>
          </section>

          <section className={styles.section}>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients?.map(({ id, measure }) => (
                <li key={id._id || id}>
                  {typeof id === 'object' && id.name ? id.name : id} — {measure}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.stepsTitle}>Preparation Steps:</h3>
            {recipe.instructions
              ?.split('. ')
              .filter(Boolean)
              .map((step, index) => (
                <p key={index} className={styles.stepText}>
                  {step.trim()}.
                </p>
              ))}
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <h3>General informations</h3>
            </div>
            <div>
              <p>
                <b>Category:</b>{' '}
                <span className={styles.span}>{recipe.category}</span>
              </p>
            </div>
            <div>
              <p>
                <b>Cooking time:</b>{' '}
                <span className={styles.span}>{recipe.time} minutes</span>
              </p>
            </div>
            <div>
              <p>
                <b>Calorie content:</b>{' '}
                <span className={styles.span}>{recipe.calories || 'N/A'}</span>
              </p>
            </div>
          </div>

          {isOwner ? (
            <DeleteRecipeButton
              recipeId={recipe._id}
              className={styles.largeDeleteBtn}
            />
          ) : (
            <SaveRecipeButton recipeId={recipe._id} />
          )}
        </aside>
      </div>
    </div>
  );
};

export default RecipeDetails;
