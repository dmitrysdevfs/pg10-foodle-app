import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

// Diagnostics
console.log('API Base URL:', API_BASE_URL);

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

    console.log('Fetching recipes from:', `${API_BASE_URL}`);
    const response = await axios.get('/api/recipes', { params });
    console.log('API Response:', response);
    console.log('Total recipes count:', response.data.data.length);
    console.log('First recipe structure:', response.data.data[0]);
    console.log(
      'Recipe object keys:',
      Object.keys(response.data.data[0] || {})
    );

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
    console.log(
      'Fetching recipe by ID from:',
      `${API_BASE_URL}/api/recipes/${id}`
    );
    const response = await axios.get(`/api/recipes/${id}`);
    console.log('API Response:', response);
    console.log('Recipe data structure:', response.data);
    console.log('Recipe object keys:', Object.keys(response.data));
    console.log('Recipe ID from response:', response.data._id);
    console.log('Recipe title:', response.data.title);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};
