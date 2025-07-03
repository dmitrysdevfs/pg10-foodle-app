import { useEffect, useState } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { useSearchParams } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import LoadMoreBtn from '../../components/Button/Button';
import s from './MainPage.module.css';
import clsx from 'clsx';

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search') || '';
  const [filters, setFilters] = useState({ category: '', ingredient: '' });

  const {
    recipes,
    isLoading,
    error,
    hasNextPage,
    totalItems,
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
    <main className={s.main}>
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
        {isLoading && <p>Loading...</p>}
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
    </main>
  );
};

export default MainPage;
