import axios from 'axios';

const API_BASE_URL = 'https://chefpad.onrender.com/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

export const ingredientAPI = {
  getAll: () => apiClient.get('/ingredient'),
  create: (data) => apiClient.post('/ingredient', data),
  delete: (id) => apiClient.delete(`/ingredient/${id}`),
};

export const foodAPI = {
  getAll: () => apiClient.get('/food'),
  getById: (id) => apiClient.get(`/food/${id}`),
  create: (data) => apiClient.post('/food', data),
  update: (id, data) => apiClient.put(`/food/${id}`, data),
  delete: (id) => apiClient.delete(`/food/${id}`, { params: { id } }),
};

export const allergenAPI = {
  getAll: () => apiClient.get('/allergen'),
};

export const mealScheduleAPI = {
  get: (from = undefined, to = undefined) =>
    apiClient.get('/meal-schedule', {
      params: { from, to },
    }),
  create: (data) => apiClient.post('/meal-schedule', data),
  delete: (id) => apiClient.delete('/meal-schedule', { params: { id } }),
};

export const shoppingListAPI = {
  get: () => apiClient.get('/shopping-list'),
  create: (data) => apiClient.post('/shopping-list', data),
  delete: (id) => apiClient.delete('/shopping-list', { params: { id } }),
};

export default apiClient;
