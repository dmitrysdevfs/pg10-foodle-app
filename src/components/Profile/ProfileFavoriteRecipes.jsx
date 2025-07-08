import ProfileRecipesSection from './ProfileRecipesSection';
import {
  selectFavoriteRecipes,
  selectFavoriteHasMore,
  selectFavoritePage,
  selectLoading,
  selectError,
} from '../../redux/profile/selectors';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';

export default function ProfileFavoriteRecipes() {
  return (
    <ProfileRecipesSection
      fetchAction={fetchFavoriteRecipes}
      selectRecipes={selectFavoriteRecipes}
      selectLoading={selectLoading}
      selectError={selectError}
      selectHasMore={selectFavoriteHasMore}
      selectPage={selectFavoritePage}
      type="favorites"
    />
  );
}
