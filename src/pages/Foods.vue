<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">🍽️</span>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Jedlá</h1>
        </div>
        <p class="text-gray-600">Prehliadaj a spravuj všetky dostupné jedlá</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative">
          <span class="absolute left-4 top-3.5 text-gray-400">🔍</span>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Vyhľadaj jedlo..."
            class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Načítavam jedlá...</p>
      </div>

      <!-- Foods Grid -->
      <div v-else-if="filteredFoods.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="food in filteredFoods"
          :key="food.id"
          @click="selectFood(food)"
          class="bg-white rounded-lg shadow-md hover:shadow-xl p-6 cursor-pointer transition-all hover:translate-y-[-4px] group"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ food.name }}
            </h3>
            <span class="text-2xl">🍽️</span>
          </div>
          <p class="text-gray-600 text-sm">Kliknite pre detaily</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <span class="text-6xl">🍽️</span>
        <p class="text-gray-600 text-lg mt-4">
          {{ foods.length === 0 ? 'Zatiaľ nie sú žiadne jedlá' : 'Žiadne jedlá nezodpovedajú vyhľadávaniu' }}
        </p>
      </div>

      <!-- Stats -->
      <div v-if="!loading && foods.length > 0" class="mt-12 bg-blue-50 rounded-lg p-6">
        <p class="text-gray-700 text-center">
          <span class="font-bold text-blue-600">{{ filteredFoods.length }}</span> z 
          <span class="font-bold">{{ foods.length }}</span> jedál
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { foodAPI } from '../api/api-client';

export default {
  name: 'Foods',
  data() {
    return {
      foods: [],
      searchTerm: '',
      loading: false,
    };
  },
  computed: {
    filteredFoods() {
      return this.foods.filter(food =>
        food.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  mounted() {
    this.loadFoods();
  },
  methods: {
    async loadFoods() {
      try {
        this.loading = true;
        const res = await foodAPI.getAll();
        this.foods = res.data;
        this.$store.dispatch('setFoods', this.foods);
      } catch (error) {
        console.error('Chyba pri načítaní jedál:', error);
        this.$store.dispatch('setError', 'Chyba pri načítaní jedál');
      } finally {
        this.loading = false;
      }
    },
    selectFood(food) {
      this.$store.dispatch('setSelectedFood', food);
      this.$router.push({ name: 'FoodDetail', params: { id: food.id } });
    },
  },
};
</script>

<style scoped>
</style>
