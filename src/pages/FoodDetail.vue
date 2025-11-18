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
      <div v-else-if="details" class="space-y-6">
        <!-- Header Card -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-black mb-4">{{ details.name }}</h1>
              
              <!-- Description -->
              <div v-if="details.description" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-blue-900 mb-2">📝 Popis</h3>
                <p class="text-black leading-relaxed">{{ details.description }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 md:min-w-[200px]">
              <button
                @click="addAllToShoppingList"
                class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                🛒 Pridať do košíka
              </button>
              <button
                @click="showMealScheduleModal = true"
                class="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                📅 Pridať do plánu
              </button>
            </div>
          </div>
        </div>

        <!-- Ingredients Section -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <span>🥗</span>
            Ingrediencie ({{ details.ingredients?.length || 0 }})
          </h2>
          
          <div v-if="details.ingredients && details.ingredients.length > 0" class="space-y-3">
            <div
              v-for="item in details.ingredients"
              :key="item.id"
              class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="font-bold text-black text-lg mb-2">
                    {{ item.ingredient.name }}
                  </h3>
                  <p class="text-blue-600 font-semibold text-lg">
                    {{ item.amount }} {{ item.unit }}
                  </p>
                </div>
                
                <!-- Allergens -->
                <div v-if="item.ingredient.allergens && item.ingredient.allergens.length > 0" class="flex flex-wrap gap-2 justify-end max-w-xs">
                  <span
                    v-for="allergen in item.ingredient.allergens"
                    :key="allergen.id"
                    class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  >
                    ⚠️ {{ allergen.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-600 italic text-center py-8">Žiadne ingrediencie registrované</p>
        </div>

        <!-- Allergens Summary -->
        <div v-if="hasAllergens" class="bg-yellow-50 border border-yellow-300 rounded-lg p-6 shadow-md">
          <h3 class="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-lg">
            <span>⚠️</span>
            Alergény v tomto jedle:
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="allergen in uniqueAllergens"
              :key="allergen"
              class="bg-yellow-100 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold"
            >
              {{ allergen }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Meal Schedule Modal -->
    <div v-if="showMealScheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full">
        <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
          <h2 class="text-2xl font-bold">📅 Pridať do plánu</h2>
        </div>
        <form @submit.prevent="addToMealSchedule" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-black mb-2">Dátum</label>
            <input v-model="mealScheduleForm.date" type="date" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-black mb-2">Časť dňa</label>
            <select v-model="mealScheduleForm.dayPart" required class="w-full px-4 py-2 border rounded-lg">
              <option value="">Vyber časť dňa</option>
              <option value="RANAJKY">🌅 Raňajky</option>
              <option value="DESIATA">☕ Desiata</option>
              <option value="OBED">🍽️ Obed</option>
              <option value="OLOVRANT">🍪 Olovrant</option>
              <option value="VECERA">🌙 Večera</option>
              <option value="NESKORA_VECERA">🌃 Neskorá večera</option>
            </select>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showMealScheduleModal = false" class="flex-1 px-6 py-3 border rounded-lg">Zrušiť</button>
            <button type="submit" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg">Pridať</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { foodAPI, shoppingListAPI, mealScheduleAPI } from '../api/api-client';

export default {
  name: 'FoodDetail',
  data() {
    return {
      details: null,
      loading: true,
      error: null,
      showMealScheduleModal: false,
      mealScheduleForm: {
        date: '',
        dayPart: '',
      },
    };
  },
  computed: {
    hasAllergens() {
      return (
        this.details?.ingredients?.some(
          (item) => item.ingredient.allergens && item.ingredient.allergens.length > 0
        ) || false
      );
    },
    uniqueAllergens() {
      if (!this.details?.ingredients) return [];
      const allergens = new Set();
      this.details.ingredients.forEach((item) => {
        item.ingredient.allergens?.forEach((allergen) => {
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
    async addAllToShoppingList() {
      if (!this.details?.ingredients || this.details.ingredients.length === 0) {
        alert('Toto jedlo nemá žiadne ingrediencie');
        return;
      }

      try {
        const promises = this.details.ingredients.map(item =>
          shoppingListAPI.create({
            ingredientId: item.ingredient.id,
            amount: item.amount,
            unit: item.unit,
          })
        );
        await Promise.all(promises);
        this.$store.dispatch('setSuccess', 'Všetky ingrediencie boli pridané do nákupného zoznamu');
      } catch (error) {
        console.error('Chyba pri pridávaní do nákupného zoznamu:', error);
        this.$store.dispatch('setError', 'Chyba pri pridávaní do nákupného zoznamu');
      }
    },
    async addToMealSchedule() {
      try {
        await mealScheduleAPI.create({
          date: this.mealScheduleForm.date,
          foodId: parseInt(this.$route.params.id),
          dayPart: this.mealScheduleForm.dayPart,
        });
        this.showMealScheduleModal = false;
        this.$store.dispatch('setSuccess', 'Jedlo bolo pridané do plánu');
      } catch (error) {
        console.error('Chyba pri pridávaní do plánu:', error);
        this.$store.dispatch('setError', 'Chyba pri pridávaní do plánu');
      }
    },
  },
};
</script>

<style scoped>
</style>
