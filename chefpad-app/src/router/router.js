import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Foods from '../pages/Foods.vue';
import FoodDetail from '../pages/FoodDetail.vue';
import Ingredients from '../pages/Ingredients.vue';
import MealSchedule from '../pages/MealSchedule.vue';
import ShoppingList from '../pages/ShoppingList.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/foods',
    name: 'Foods',
    component: Foods,
  },
  {
    path: '/foods/:id',
    name: 'FoodDetail',
    component: FoodDetail,
  },
  {
    path: '/ingredients',
    name: 'Ingredients',
    component: Ingredients,
  },
  {
    path: '/meal-schedule',
    name: 'MealSchedule',
    component: MealSchedule,
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: ShoppingList,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;