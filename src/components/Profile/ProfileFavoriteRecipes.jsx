import ProfileRecipesSection from './ProfileRecipesSection';
import {
  selectFavoriteRecipes,
  selectFavoriteHasMore,
  selectFavoritePage,
  selectLoading,
  selectError,
  selectFavoriteTotalItems,
  selectPerPage,
} from '../../redux/profile/selectors';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';
import s from './ProfileNavigation/ProfileNavigation.module.css';

export default function ProfileFavoriteRecipes() {
  return (
    <div className={s.innerWrapper}>
      <ProfileRecipesSection
        fetchAction={fetchFavoriteRecipes}
        selectRecipes={selectFavoriteRecipes}
        selectLoading={selectLoading}
        selectError={selectError}
        selectHasMore={selectFavoriteHasMore}
        selectPage={selectFavoritePage}
        selectTotalItems={selectFavoriteTotalItems}
        perPage={selectPerPage}
        type="favorites"
      />
    </div>
  );
}
