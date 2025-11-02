import { createStore } from 'vuex';

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
      currentUserId: 1,
      selectedFood: null,
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

    setCurrentUserId(state, userId) {
      state.currentUserId = userId;
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

    setCurrentUserId({ commit }, userId) {
      commit('setCurrentUserId', userId);
    },

    clearStore({ commit }) {
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

    getCurrentUserId(state) {
      return state.currentUserId;
    },

    getSelectedFood(state) {
      return state.selectedFood;
    },
  },
});