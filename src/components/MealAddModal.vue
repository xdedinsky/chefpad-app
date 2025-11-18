<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full">
      <!-- Header -->
      <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
        <h2 class="text-2xl font-bold">📅 Pridať jedlo do plánu</h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
        <!-- Dátum -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Dátum <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Jedlo -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Jedlo <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.foodId"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>Vyber jedlo</option>
            <option v-for="food in foods" :key="food.id" :value="food.id">
              {{ food.name }}
            </option>
          </select>
        </div>

        <!-- Denná časť -->
        <div>
          <label class="block text-sm font-semibold text-black mb-2">
            Časť dňa <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.dayPart"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>Vyber časť dňa</option>
            <option value="RANAJKY">🌅 Raňajky</option>
            <option value="DESIATA">☕ Desiata</option>
            <option value="OBED">🍽️ Obed</option>
            <option value="OLOVRANT">🍪 Olovrant</option>
            <option value="VECERA">🌙 Večera</option>
            <option value="NESKORA_VECERA">🌃 Neskorá večera</option>
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
            class="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Pridávam...' : 'Pridať do plánu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mealScheduleAPI, foodAPI } from '../api/api-client';

export default {
  name: 'MealAddModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        date: '',
        foodId: '',
        dayPart: '',
      },
      foods: [],
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
      this.form = { date: '', foodId: '', dayPart: '' };
      this.error = null;
      try {
        const res = await foodAPI.getAll();
        this.foods = res.data;
      } catch (err) {
        console.error('Chyba pri načítaní jedál:', err);
        this.error = 'Nepodarilo sa načítať zoznam jedál';
      }
    },
    async submitForm() {
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          date: this.form.date,
          foodId: parseInt(this.form.foodId),
          dayPart: this.form.dayPart,
        };
        await mealScheduleAPI.create(payload);
        this.$emit('success');
        this.$emit('close');
      } catch (err) {
        console.error('Chyba pri pridávaní do plánu:', err);
        this.error = err.response?.data?.message || 'Chyba pri pridávaní jedla do plánu';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
