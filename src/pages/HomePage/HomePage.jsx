import { useState, useCallback } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import SearchBox from '../../components/SearchBox/SearchBox';
import Filters from '../../components/Filters/Filters';
import RecipesList from '../../components/RecipesList/RecipesList';
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn';
import s from './HomePage.module.css';
import clsx from 'clsx';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', ingredient: '' });
  const [page, setPage] = useState(1);
  const { recipes, isLoading, error } = useRecipes();

  if (error) return <>Error: {error}</>;

  const handleSearch = useCallback(query => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback(newFilters => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
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
          <span className={s.recipesCount}>12 recipes</span>
          <Filters onChange={handleFiltersChange} />
        </div>
        {isLoading ? <p>Loading...</p> : <RecipesList recipes={recipes} />}

        <LoadMoreBtn onClick={handleLoadMore} />
      </section>
    </main>
  );
};

export default HomePage;
