import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchRecipes,
  clearRecipes,
  setSearchQuery,
  setFilters,
  selectRecipes,
  selectIsLoading,
  selectError,
  selectHasNextPage,
  selectCurrentPage,
  selectSearchQuery,
  selectFilters,
  selectTotalItems,
} from '../redux/recipesSlice';

export const useRecipes = () => {
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const hasNextPage = useSelector(selectHasNextPage);
  const currentPage = useSelector(selectCurrentPage);
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const totalItems = useSelector(selectTotalItems);

  // Завантаження рецептів
  const loadRecipes = (params = {}) => {
    const { search = searchQuery, page = 1, ...otherFilters } = params;

    if (page === 1) {
      dispatch(clearRecipes());
    }

    dispatch(
      fetchRecipes({
        search,
        ...filters,
        ...otherFilters,
        page,
      })
    );
  };

  // Пошук рецептів
  const searchRecipes = query => {
    dispatch(setSearchQuery(query));
    loadRecipes({ search: query, page: 1 });
  };

  // Зміна фільтрів
  const updateFilters = newFilters => {
    dispatch(setFilters(newFilters));
    loadRecipes({ ...newFilters, page: 1 });
  };

  // Завантаження більше рецептів
  const loadMore = () => {
    if (hasNextPage && !isLoading) {
      loadRecipes({ page: currentPage + 1 });
    }
  };

  // Відображення toast повідомлень при помилках або відсутності результатів
  useEffect(() => {
    if (error) {
      toast.error(`Error loading recipes: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (
      !isLoading &&
      recipes.length === 0 &&
      (searchQuery || filters.category || filters.ingredient)
    ) {
      toast('No recipres, for your query!', {
        icon: '🔍',
        style: {
          background: '#f59e0b',
          color: '#fff',
        },
      });
    }
  }, [isLoading, recipes.length, searchQuery, filters]);

  return {
    recipes,
    isLoading,
    error,
    hasNextPage,
    searchQuery,
    filters,
    totalItems,
    loadRecipes,
    searchRecipes,
    updateFilters,
    loadMore,
  };
};
