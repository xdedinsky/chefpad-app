<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-black">
          {{ isEditMode ? '✏️ Upraviť jedlo' : '➕ Pridať nové jedlo' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Názov -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Názov jedla <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Napr. Francúzska cibuľačka"
          />
        </div>

        <!-- Popis -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Popis
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Krátky popis jedla..."
          ></textarea>
        </div>

        <!-- Ingrediencie -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Ingrediencie <span class="text-red-500">*</span>
          </label>
          
          <div class="space-y-3 mb-3">
            <div
              v-for="(item, index) in formData.ingredients"
              :key="index"
              class="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
            >
              <select
                v-model="item.ingredientId"
                required
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Vyber ingredienciu</option>
                <option v-for="ing in availableIngredients" :key="ing.id" :value="ing.id">
                  {{ ing.name }}
                </option>
              </select>
              
              <input
                v-model.number="item.amount"
                type="number"
                step="0.01"
                required
                min="0"
                class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
              
              <select
                v-model="item.unit"
                required
                class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="ks">ks</option>
              </select>
              
              <button
                type="button"
                @click="removeIngredient(index)"
                class="text-red-600 hover:text-red-800 font-bold text-xl px-2"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <button
            type="button"
            @click="addIngredient"
            class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            + Pridať ingredienciu
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-black font-semibold hover:bg-gray-50 transition-colors"
          >
            Zrušiť
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Ukladám...' : (isEditMode ? 'Uložiť zmeny' : 'Vytvoriť jedlo') }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ⚠️ {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { foodAPI, ingredientAPI } from '../api/api-client';

export default {
  name: 'FoodFormModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    food: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        name: '',
        description: '',
        ingredients: [],
      },
      availableIngredients: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    isEditMode() {
      return this.food !== null;
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.loadIngredients();
        this.resetForm();
      }
    },
  },
  methods: {
    async loadIngredients() {
      try {
        const res = await ingredientAPI.getAll();
        this.availableIngredients = res.data;
      } catch (err) {
        console.error('Chyba pri načítaní ingrediencií:', err);
        this.error = 'Nepodarilo sa načítať ingrediencie';
      }
    },
    resetForm() {
      if (this.isEditMode && this.food) {
        this.formData = {
          name: this.food.name,
          description: this.food.description || '',
          ingredients: this.food.ingredients?.map(item => ({
            ingredientId: item.ingredient.id,
            amount: item.amount,
            unit: item.unit,
          })) || [],
        };
      } else {
        this.formData = {
          name: '',
          description: '',
          ingredients: [],
        };
      }
      this.error = null;
    },
    addIngredient() {
      this.formData.ingredients.push({
        ingredientId: '',
        amount: 0,
        unit: 'g',
      });
    },
    removeIngredient(index) {
      this.formData.ingredients.splice(index, 1);
    },
    async submitForm() {
      if (this.formData.ingredients.length === 0) {
        this.error = 'Musíš pridať aspoň jednu ingredienciu';
        return;
      }

      try {
        this.loading = true;
        this.error = null;

        const payload = {
          name: this.formData.name,
          description: this.formData.description || undefined,
          ingredients: this.formData.ingredients,
        };

        if (this.isEditMode) {
          await foodAPI.update(this.food.id, payload);
        } else {
          await foodAPI.create(payload);
        }

        this.$emit('success');
        this.$emit('close');
      } catch (err) {
        console.error('Chyba pri ukladaní jedla:', err);
        this.error = err.response?.data?.message || 'Chyba pri ukladaní jedla';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
