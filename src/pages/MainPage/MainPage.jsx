import { useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import LoadMoreBtn from '../../components/Button/Button';
import s from './MainPage.module.css';
import clsx from 'clsx';

const MainPage = () => {
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
    loadRecipes();
  }, []);

  const handleSearch = query => {
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
          <SearchBox onSearch={handleSearch} />
        </div>
      </section>
      <section className={clsx(s.recipesSection, s.container)}>
        <h2 className={s.recipesTitle}>Recipes</h2>
        <div className={s.filterContainer}>
          <span className={s.recipesCount}>
            {totalItems > 0 ? `${totalItems} recipes` : 'No recipes'}
          </span>
          <Filters onChange={handleFiltersChange} />
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
