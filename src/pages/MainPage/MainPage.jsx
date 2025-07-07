import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import LoadMoreBtn from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import {
  fetchRecipes,
  fetchCategoriesAsync,
  fetchIngredientsAsync,
  setSearchQuery,
  setFilters,
} from '../../redux/recipes/recipesSlice';
import {
  selectRecipes,
  selectIsLoading,
  selectError,
  selectHasNextPage,
  selectSearchQuery,
  selectFilters,
  selectTotalItems,
  selectCategories,
  selectIngredients,
} from '../../redux/recipes/selectors';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import s from './MainPage.module.css';
import clsx from 'clsx';

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search') || '';
  const categoryValue = searchParams.get('category') || '';
  const ingredientValue = searchParams.get('ingredient') || '';
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const hasNextPage = useSelector(selectHasNextPage);
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const totalItems = useSelector(selectTotalItems);
  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
    if (ingredients.length === 0) {
      dispatch(fetchIngredientsAsync());
    }
  }, [dispatch, categories.length, ingredients.length]);

  useEffect(() => {
    const newFilters = {
      category: categoryValue,
      ingredient: ingredientValue,
    };

    if (
      categoryValue !== filters.category ||
      ingredientValue !== filters.ingredient
    ) {
      dispatch(setFilters(newFilters));
    }

    if (searchValue !== searchQuery) {
      dispatch(setSearchQuery(searchValue));
    }
  }, [categoryValue, ingredientValue, searchValue, dispatch]);

  useEffect(() => {
    dispatch(
      fetchRecipes({
        search: searchQuery,
        ...filters,
      })
    );
  }, [searchQuery, filters.category, filters.ingredient, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteRecipes());
    }
  }, [dispatch, isLoggedIn]);

  const handleSearch = useCallback(
    query => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (query) {
          params.set('search', query);
        } else {
          params.delete('search');
        }
        return params;
      });
    },
    [setSearchParams]
  );

  const handleFiltersChange = newFilters => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (newFilters.category) {
        params.set('category', newFilters.category);
      } else {
        params.delete('category');
      }
      if (newFilters.ingredient) {
        params.set('ingredient', newFilters.ingredient);
      } else {
        params.delete('ingredient');
      }
      return params;
    });
    dispatch(setFilters(newFilters));
  };

  const handleLoadMore = () => {
    dispatch(
      fetchRecipes({
        search: searchQuery,
        ...filters,
        page: Math.ceil(recipes.length / 10) + 1,
      })
    );
  };

  return (
    <>
      <section className={s.hero}>
        <div className={s.container}>
          <div className={s.heroContent}>
            <h1 className={s.heroTitle}>
              Plan, Cook, and
              <br />
              Share Your Flavors
            </h1>
            <SearchBox onSearch={handleSearch} value={searchValue} />
          </div>
        </div>
      </section>
      <section className={clsx(s.recipesSection, s.container)}>
        <h2 className={s.recipesTitle}>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Recipes'}
        </h2>
        <div className={s.filterContainer}>
          <Filters totalItems={totalItems} onChange={handleFiltersChange} />
        </div>
        {isLoading && <Loader />}
        {error && <div className={s.error}>Error: {error}</div>}
        <RecipesList recipes={recipes} />
        {!isLoading && hasNextPage && (
          <LoadMoreBtn
            onClick={handleLoadMore}
            text="Load More"
            className={s.loadMoreBtn}
          />
        )}
      </section>
    </>
  );
};

export default MainPage;
