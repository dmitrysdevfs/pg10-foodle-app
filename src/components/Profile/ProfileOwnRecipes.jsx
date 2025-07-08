import ProfileRecipesSection from './ProfileRecipesSection';
import {
  selectOwnRecipes,
  selectOwnHasMore,
  selectOwnPage,
  selectLoading,
  selectError,
} from '../../redux/profile/selectors';
import { fetchOwnRecipes } from '../../redux/profile/operations';

const ProfileOwnRecipes = () => {
  return (
    <ProfileRecipesSection
      fetchAction={fetchOwnRecipes}
      selectRecipes={selectOwnRecipes}
      selectLoading={selectLoading}
      selectError={selectError}
      selectHasMore={selectOwnHasMore}
      selectPage={selectOwnPage}
      type="own"
    />
  );
};

export default ProfileOwnRecipes;
