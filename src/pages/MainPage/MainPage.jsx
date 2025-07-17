import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import Pagination from '../../components/Pagination/Pagination';
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
  selectSearchQuery,
  selectFilters,
  selectTotalItems,
  selectCategories,
  selectIngredients,
  selectPerPage,
} from '../../redux/recipes/selectors';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import s from './MainPage.module.css';
import clsx from 'clsx';

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search') || '';
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const totalItems = useSelector(selectTotalItems);
  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const perPageValue = useSelector(selectPerPage);

  const pageParam = Number(searchParams.get('page')) || 1;
  const page = pageParam;
  const totalPages = Math.ceil(totalItems / perPageValue);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
    if (ingredients.length === 0) {
      dispatch(fetchIngredientsAsync());
    }
  }, [dispatch, categories.length, ingredients.length]);

  // fetchRecipes тільки по Redux-стану
  useEffect(() => {
    dispatch(
      fetchRecipes({
        search: searchQuery,
        category: filters.category,
        ingredient: filters.ingredient,
        page,
      })
    );
  }, [searchQuery, filters.category, filters.ingredient, page, dispatch]);

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
        params.delete('page');
        return params;
      });
      dispatch(setSearchQuery(query));
    },
    [setSearchParams, dispatch]
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
      params.delete('page');
      return params;
    });
    dispatch(setFilters(newFilters));
  };

  const handleResetAll = () => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.delete('search');
      params.delete('category');
      params.delete('ingredient');
      params.delete('page');
      return params;
    });
    dispatch(setFilters({ category: '', ingredient: '' }));
    dispatch(setSearchQuery(''));
  };

  const handlePageChange = newPage => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage);
      return params;
    });
    dispatch(
      fetchRecipes({
        search: searchQuery,
        category: filters.category,
        ingredient: filters.ingredient,
        page: newPage,
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
          <Filters
            totalItems={totalItems}
            onChange={handleFiltersChange}
            onReset={handleResetAll}
          />
        </div>
        <div className={s.recipesContainer}>
          {isLoading ? (
            <div className={s.loaderContainer}>
              <Loader />
            </div>
          ) : error ? (
            <div className={s.error}>Error: {error}</div>
          ) : (
            <RecipesList recipes={recipes} />
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </>
  );
};

export default MainPage;
