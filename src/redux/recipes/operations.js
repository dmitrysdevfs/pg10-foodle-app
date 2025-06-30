import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

// Diagnostics
console.log('API Base URL:', API_BASE_URL);

export const fetchRecipes = async () => {
  try {
    console.log('Fetching recipes from:', `${API_BASE_URL}/api/recipes`);
    const response = await axios.get('/api/recipes');
    console.log('API Response:', response);

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
