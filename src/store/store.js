import { createStore } from 'vuex';
import { authAPI } from '../api/api-client';

export default createStore({
  state() {
    return {
      ingredients: [],
      foods: [],
      allergens: [],
      mealSchedules: [],
      shoppingList: [],
      loading: false,
      error: null,
      selectedFood: null,
      
      authToken: localStorage.getItem('authToken') || null,
      user: JSON.parse(localStorage.getItem('user')) || null,
      isAuthenticated: !!localStorage.getItem('authToken'),
    };
  },

  mutations: {
    setIngredients(state, ingredients) {
      state.ingredients = ingredients;
    },

    addIngredient(state, ingredient) {
      state.ingredients.push(ingredient);
    },

    removeIngredient(state, id) {
      state.ingredients = state.ingredients.filter(i => i.id !== id);
    },

    setFoods(state, foods) {
      state.foods = foods;
    },

    setSelectedFood(state, food) {
      state.selectedFood = food;
    },

    setAllergens(state, allergens) {
      state.allergens = allergens;
    },

    setMealSchedules(state, schedules) {
      state.mealSchedules = schedules;
    },

    setShoppingList(state, items) {
      state.shoppingList = items;
    },

    setLoading(state, loading) {
      state.loading = loading;
    },

    setError(state, error) {
      state.error = error;
    },

    setAuthToken(state, token) {
      state.authToken = token;
      state.isAuthenticated = !!token;
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    },

    setUser(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },

    logout(state) {
      state.authToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },

    clearStore(state) {
      state.ingredients = [];
      state.foods = [];
      state.allergens = [];
      state.mealSchedules = [];
      state.shoppingList = [];
      state.loading = false;
      state.error = null;
      state.selectedFood = null;
    },
  },

  actions: {
    setIngredients({ commit }, ingredients) {
      commit('setIngredients', ingredients);
    },

    addIngredient({ commit }, ingredient) {
      commit('addIngredient', ingredient);
    },

    removeIngredient({ commit }, id) {
      commit('removeIngredient', id);
    },

    setFoods({ commit }, foods) {
      commit('setFoods', foods);
    },

    setSelectedFood({ commit }, food) {
      commit('setSelectedFood', food);
    },

    setAllergens({ commit }, allergens) {
      commit('setAllergens', allergens);
    },

    setMealSchedules({ commit }, schedules) {
      commit('setMealSchedules', schedules);
    },

    setShoppingList({ commit }, items) {
      commit('setShoppingList', items);
    },

    setLoading({ commit }, loading) {
      commit('setLoading', loading);
    },

    setError({ commit }, error) {
      commit('setError', error);
    },

    async login({ commit }, credentials) {
      try {
        const response = await authAPI.login(credentials);
        const { token } = response.data;
        
        commit('setAuthToken', token);
        
        commit('setUser', { email: credentials.email });
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Prihlásenie zlyhalo' 
        };
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await authAPI.register(userData);
        const { id } = response.data;
        
        const loginResult = await authAPI.login({
          email: userData.email,
          password: userData.password,
        });
        
        const { token } = loginResult.data;
        
        commit('setAuthToken', token);
        commit('setUser', {
          id,
          email: userData.email,
          name: userData.name,
          lastName: userData.lastName,
        });
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Registrácia zlyhala' 
        };
      }
    },

    logout({ commit }) {
      commit('logout');
      commit('clearStore');
    },
  },

  getters: {
    getIngredients(state) {
      return state.ingredients;
    },

    getFoods(state) {
      return state.foods;
    },

    getAllergens(state) {
      return state.allergens;
    },

    getMealSchedules(state) {
      return state.mealSchedules;
    },

    getShoppingList(state) {
      return state.shoppingList;
    },

    isLoading(state) {
      return state.loading;
    },

    getError(state) {
      return state.error;
    },

    getSelectedFood(state) {
      return state.selectedFood;
    },

    isAuthenticated(state) {
      return state.isAuthenticated;
    },

    currentUser(state) {
      return state.user;
    },

    authToken(state) {
      return state.authToken;
    },
  },
});
