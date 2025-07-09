import ProfileRecipesSection from './ProfileRecipesSection';
import {
  selectOwnRecipes,
  selectOwnHasMore,
  selectOwnPage,
  selectLoading,
  selectError,
  selectOwnTotalItems,
  selectPerPage,
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
      selectTotalItems={selectOwnTotalItems}
      perPage={selectPerPage}
      type="own"
    />
  );
};

export default ProfileOwnRecipes;
