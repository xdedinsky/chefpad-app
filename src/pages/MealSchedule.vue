<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">📅</span>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Plán jedál</h1>
        </div>
        <p class="text-gray-600">Prehľad naplánovaných jedál podľa dňa</p>
      </div>

      <!-- Date Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Od
            </label>
            <input
              v-model="fromDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Do
            </label>
            <input
              v-model="toDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Načítavam plán jedál...</p>
      </div>

      <!-- Meal Schedules -->
      <div v-else-if="mealSchedules.length > 0" class="space-y-4">
        <div
          v-for="(schedule, idx) in mealSchedules"
          :key="idx"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-lg font-bold text-gray-900 mb-3">
            📅 {{ formatDate(schedule.date) }}
          </h3>
          <div class="space-y-2">
            <div
              v-if="schedule.meals && schedule.meals.length > 0"
              v-for="(meal, mealIdx) in schedule.meals"
              :key="mealIdx"
              class="flex items-center gap-3 text-gray-700 pl-4 border-l-4 border-purple-300 py-1"
            >
              <span class="text-lg">🍽️</span>
              <span>{{ meal }}</span>
            </div>
            <p v-else class="text-gray-500 italic">Žiadne jedlá naplánované</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg">
        <span class="text-6xl">📅</span>
        <p class="text-gray-600 text-lg mt-4">Žiadne naplánované jedlá</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mealScheduleAPI } from '../api/api-client';

export default {
  name: 'MealSchedule',
  data() {
    return {
      mealSchedules: [],
      fromDate: '',
      toDate: '',
      loading: false,
    };
  },
  watch: {
    fromDate() {
      this.loadMealSchedules();
    },
    toDate() {
      this.loadMealSchedules();
    },
  },
  mounted() {
    this.loadMealSchedules();
  },
  methods: {
    async loadMealSchedules() {
      try {
        this.loading = true;
        const userId = this.$store.getters.getCurrentUserId;
        const res = await mealScheduleAPI.get(
          userId,
          this.fromDate || undefined,
          this.toDate || undefined
        );
        this.mealSchedules = res.data;
        this.$store.dispatch('setMealSchedules', this.mealSchedules);
      } catch (error) {
        console.error('Chyba pri načítaní plánu jedál:', error);
        this.$store.dispatch('setError', 'Chyba pri načítaní plánu jedál');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('sk-SK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
</style>
