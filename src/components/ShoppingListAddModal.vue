<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full">
      <!-- Header -->
      <div class="bg-green-600 text-white px-6 py-4 rounded-t-lg">
        <h2 class="text-2xl font-bold">🛒 Pridať do nákupného zoznamu</h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
        <!-- Ingrediencia -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Ingrediencia <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.ingredientId"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>Vyber ingredienciu</option>
            <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">
              {{ ingredient.name }}
            </option>
          </select>
        </div>

        <!-- Množstvo -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Množstvo <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Napr. 500"
          />
        </div>

        <!-- Jednotka -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Jednotka <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.unit"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>Vyber jednotku</option>
            <option value="g">g (gramy)</option>
            <option value="kg">kg (kilogramy)</option>
            <option value="ml">ml (mililitre)</option>
            <option value="l">l (litre)</option>
            <option value="ks">ks (kusy)</option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ⚠️ {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
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
            class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Pridávam...' : 'Pridať do zoznamu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { shoppingListAPI, ingredientAPI } from '../api/api-client';

export default {
  name: 'ShoppingListAddModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        ingredientId: '',
        amount: 0,
        unit: 'g',
      },
      ingredients: [],
      loading: false,
      error: null,
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.init();
      }
    },
  },
  methods: {
    async init() {
      this.form = { ingredientId: '', amount: 0, unit: 'g' };
      this.error = null;
      try {
        const res = await ingredientAPI.getAll();
        this.ingredients = res.data;
      } catch (err) {
        console.error('Chyba pri načítaní ingrediencií:', err);
        this.error = 'Nepodarilo sa načítať zoznam ingrediencií';
      }
    },
    async submitForm() {
      if (this.form.amount <= 0) {
        this.error = 'Množstvo musí byť väčšie ako 0';
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const payload = {
          ingredientId: parseInt(this.form.ingredientId),
          amount: parseFloat(this.form.amount),
          unit: this.form.unit,
        };
        await shoppingListAPI.create(payload);
        this.$emit('success');
        this.$emit('close');
      } catch (err) {
        console.error('Chyba pri pridávaní do nákupného zoznamu:', err);
        this.error = err.response?.data?.message || 'Chyba pri pridávaní do nákupného zoznamu';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
