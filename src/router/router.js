import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/store';
import Home from '../pages/Home.vue';
import Foods from '../pages/Foods.vue';
import FoodDetail from '../pages/FoodDetail.vue';
import Ingredients from '../pages/Ingredients.vue';
import MealSchedule from '../pages/MealSchedule.vue';
import ShoppingList from '../pages/ShoppingList.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/foods',
    name: 'Foods',
    component: Foods,
    meta: { requiresAuth: true },
  },
  {
    path: '/foods/:id',
    name: 'FoodDetail',
    component: FoodDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/ingredients',
    name: 'Ingredients',
    component: Ingredients,
    meta: { requiresAuth: true },
  },
  {
    path: '/meal-schedule',
    name: 'MealSchedule',
    component: MealSchedule,
    meta: { requiresAuth: true },
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: ShoppingList,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;