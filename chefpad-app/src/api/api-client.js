import axios from 'axios';

const API_BASE_URL = 'https://chefpad.onrender.com/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ingredients API
export const ingredientAPI = {
  getAll: () => apiClient.get('/ingredient'),
  create: (data) => apiClient.post('/ingredient', data),
  delete: (id) => apiClient.delete(`/ingredient/${id}`),
};

// Food API
export const foodAPI = {
  getAll: () => apiClient.get('/food'),
  getById: (id) => apiClient.get(`/food/${id}`),
};

// Allergens API
export const allergenAPI = {
  getAll: () => apiClient.get('/allergen'),
};

// Meal Schedule API
export const mealScheduleAPI = {
  get: (userId, from = undefined, to = undefined) =>
    apiClient.get('/meal-schedule', {
      params: { userId, from, to },
    }),
};

// Shopping List API
export const shoppingListAPI = {
  get: (userId) =>
    apiClient.get('/shopping-list', {
      params: { userId },
    }),
};

export default apiClient;