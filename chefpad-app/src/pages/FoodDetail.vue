<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors"
      >
        ← Späť
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Načítavam detaily...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <span class="text-2xl">⚠️</span>
        <div>
          <h3 class="font-bold text-red-900 mb-1">Chyba</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Food Details -->
      <div v-else-if="details" class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">{{ details.name }}</h1>

        <!-- Ingredients Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Ingrediencie ({{ details.ingredients?.length || 0 }})
          </h2>
          
          <div v-if="details.ingredients && details.ingredients.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="ingredient in details.ingredients"
              :key="ingredient.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <h3 class="font-bold text-gray-900 mb-2">{{ ingredient.name }}</h3>
              <div v-if="ingredient.allergens && ingredient.allergens.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="allergen in ingredient.allergens"
                  :key="allergen.id"
                  class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  ⚠️ {{ allergen.name }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-600 italic">Žiadne ingrediencie registrované</p>
        </div>

        <!-- Allergens Summary -->
        <div v-if="hasAllergens" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 class="font-bold text-yellow-900 mb-3">⚠️ Alergény v tomto jídle:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="allergen in uniqueAllergens"
              :key="allergen"
              class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ allergen }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { foodAPI } from '../api/api-client';

export default {
  name: 'FoodDetail',
  data() {
    return {
      details: null,
      loading: true,
      error: null,
    };
  },
  computed: {
    hasAllergens() {
      return (
        this.details?.ingredients?.some(
          (i) => i.allergens && i.allergens.length > 0
        ) || false
      );
    },
    uniqueAllergens() {
      if (!this.details?.ingredients) return [];
      const allergens = new Set();
      this.details.ingredients.forEach((ingredient) => {
        ingredient.allergens?.forEach((allergen) => {
          allergens.add(allergen.name);
        });
      });
      return Array.from(allergens);
    },
  },
  mounted() {
    this.loadDetails();
  },
  methods: {
    async loadDetails() {
      try {
        this.loading = true;
        const foodId = this.$route.params.id;
        const res = await foodAPI.getById(foodId);
        this.details = res.data;
      } catch (err) {
        console.error('Chyba pri načítaní detailov:', err);
        this.error = 'Chyba pri načítaní detailov jedla';
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push({ name: 'Foods' });
    },
  },
};
</script>

<style scoped>
</style>
