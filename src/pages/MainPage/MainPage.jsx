import { useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { useSearchParams, useLocation } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import LoadMoreBtn from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import s from './MainPage.module.css';
import clsx from 'clsx';
import { setSearchQuery, setFilters } from '../../redux/recipes/recipesSlice';
import { useDispatch } from 'react-redux';

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search') || '';
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    recipes,
    isLoading,
    error,
    hasNextPage,
    totalItems,
    filters,
    searchRecipes,
    updateFilters,
    loadMore,
    loadRecipes,
  } = useRecipes();

  useEffect(() => {
    if (searchValue) {
      searchRecipes(searchValue);
    } else {
      loadRecipes();
    }
  }, [searchValue]);

  useEffect(() => {
    dispatch(setSearchQuery(''));
    dispatch(setFilters({ category: '', ingredient: '' }));
    loadRecipes({ page: 1 });
  }, [location.key]);

  const handleSearch = query => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      return params;
    });
    searchRecipes(query);
  };

  const handleFiltersChange = newFilters => {
    updateFilters(newFilters);
  };

  const handleLoadMore = () => {
    loadMore();
  };

  return (
    <>
      <section className={clsx(s.hero, s.container)}>
        <div className={s.heroContent}>
          <h1 className={s.heroTitle}>
            Plan, Cook, and
            <br />
            Share Your Flavors
          </h1>
          <SearchBox onSearch={handleSearch} value={searchValue} />
        </div>
      </section>
      <section className={clsx(s.recipesSection, s.container)}>
        <h2 className={s.recipesTitle}>Recipes</h2>
        <div className={s.filterContainer}>
          <span className={s.recipesCount}>
            {totalItems > 0 ? `${totalItems} recipes` : 'No recipes'}
          </span>
          <Filters onChange={handleFiltersChange} filters={filters} />
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
