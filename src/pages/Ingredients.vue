<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">🥬</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-black">Ingrediencie</h1>
          </div>
          <p class="text-gray-600">Spravuj ingrediencie a ich alergény</p>
        </div>
        <button
          @click="showForm = !showForm"
          class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          ➕ <span class="hidden sm:inline">Pridať</span>
        </button>
      </div>

      <!-- Add Form -->
      <div v-if="showForm" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold mb-6 text-black">Nová ingrediencia</h2>
        <form @submit.prevent="handleAddIngredient">
          <div class="mb-4">
            <label class="block text-sm font-medium text-black mb-2">
              Názov ingrediencie
            </label>
            <input
              v-model="newIngredient"
              type="text"
              placeholder="Napr. Pšenica, Mlieko..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              :disabled="isSubmitting"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-black mb-3">
              Alergény
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <label
                v-for="allergen in allergens"
                :key="allergen.id"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="allergen.id"
                  v-model.number="selectedAllergens"
                  class="w-4 h-4 rounded border-gray-300 text-green-600"
                  :disabled="isSubmitting"
                />
                <span class="text-sm text-black">{{ allergen.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {{ isSubmitting ? 'Ukladám...' : 'Pridať ingredienciu' }}
            </button>
            <button
              type="button"
              @click="showForm = false"
              class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Zrušiť
            </button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">Načítavam ingrediencie...</p>
      </div>

      <!-- Ingredients List -->
      <div v-else-if="ingredients.length > 0" class="space-y-4">
        <div
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          class="bg-white rounded-lg shadow-md p-6 flex items-start justify-between hover:shadow-lg transition-shadow"
        >
          <div class="flex-1">
            <h3 class="text-lg font-bold text-black mb-2">{{ ingredient.name }}</h3>
            <div v-if="ingredient.allergens && ingredient.allergens.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="allergen in ingredient.allergens"
                :key="allergen.id"
                class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                ⚠️ {{ allergen.name }}
              </span>
            </div>
            <p v-else class="text-gray-500 text-sm">Bez známych alergénov</p>
          </div>
          <button
            @click="handleDeleteIngredient(ingredient.id)"
            class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Vymazať"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg">
        <span class="text-6xl">🥬</span>
        <p class="text-gray-600 text-lg mb-4 mt-4">Zatiaľ nie sú žiadne ingrediencie</p>
        <button
          @click="showForm = true"
          class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          ➕ Pridať prvú ingredienciu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ingredientAPI, allergenAPI } from '../api/api-client';

export default {
  name: 'Ingredients',
  data() {
    return {
      ingredients: [],
      allergens: [],
      newIngredient: '',
      selectedAllergens: [],
      showForm: false,
      isSubmitting: false,
      loading: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const [ingredientsRes, allergensRes] = await Promise.all([
          ingredientAPI.getAll(),
          allergenAPI.getAll(),
        ]);
        this.ingredients = ingredientsRes.data;
        this.allergens = allergensRes.data;
        this.$store.dispatch('setIngredients', this.ingredients);
        this.$store.dispatch('setAllergens', this.allergens);
      } catch (error) {
        console.error('Chyba pri načítaní údajov:', error);
        this.$store.dispatch('setError', 'Chyba pri načítaní údajov');
      } finally {
        this.loading = false;
      }
    },
    async handleAddIngredient() {
      if (!this.newIngredient.trim()) return;

      try {
        this.isSubmitting = true;
        const res = await ingredientAPI.create({
          name: this.newIngredient,
          allergenIds: this.selectedAllergens,
        });
        this.ingredients.push(res.data);
        this.$store.dispatch('addIngredient', res.data);
        this.newIngredient = '';
        this.selectedAllergens = [];
        this.showForm = false;
      } catch (error) {
        console.error('Chyba pri vytváraní ingrediencie:', error);
        this.$store.dispatch('setError', 'Chyba pri vytváraní ingrediencie');
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleDeleteIngredient(id) {
      if (!confirm('Si si istý/á?')) return;

      try {
        await ingredientAPI.delete(id);
        this.ingredients = this.ingredients.filter(i => i.id !== id);
        this.$store.dispatch('removeIngredient', id);
      } catch (error) {
        console.error('Chyba pri mazaní ingrediencie:', error);
        this.$store.dispatch('setError', 'Chyba pri mazaní ingrediencie');
      }
    },
  },
};
</script>

<style scoped>
</style>
