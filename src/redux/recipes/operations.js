import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

export const fetchRecipes = async ({
  search = '',
  category = '',
  ingredient = '',
  page = 1,
}) => {
  try {
    const params = {};
    if (search) params.title = search;
    if (category) params.category = category;
    if (ingredient) params.ingredient = ingredient;
    if (page) params.page = page;

    const response = await axios.get('/api/recipes', { params });

    const { data } = response.data;

    if (!Array.isArray(data.data)) {
      throw new Error('Unexpected data format: expected an array');
    }

    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const fetchRecipeByID = async id => {
  try {
    const response = await axios.get(`/api/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  const response = await axios.get('/api/categories');

  return response.data.data;
};

export const fetchIngredients = async () => {
  const response = await axios.get('/api/ingredients');

  return response.data.data;
};
