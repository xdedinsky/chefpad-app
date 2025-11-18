import axios from 'axios';

const API_BASE_URL = 'https://chefpad.onrender.com/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor - pridanie tokenu do každého requestu
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor - handling 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

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
  get: (from = undefined, to = undefined) =>
    apiClient.get('/meal-schedule', {
      params: { from, to },
    }),
};

// Shopping List API
export const shoppingListAPI = {
  get: () => apiClient.get('/shopping-list'),
};

export default apiClient;
