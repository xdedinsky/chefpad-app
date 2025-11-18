<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">📅</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-black">Plán jedál</h1>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            ➕ Pridať jedlo
          </button>
        </div>
        <p class="text-gray-600">Prehľad naplánovaných jedál podľa dňa</p>
      </div>

      <!-- Date Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-black mb-2" style="color: #000 !important;">
              Od
            </label>
            <input
              v-model="fromDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-black mb-2" style="color: #000 !important;">
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
      <div v-else-if="mealSchedules.length > 0" class="space-y-6">
        <div
          v-for="(schedule, idx) in groupedSchedules"
          :key="idx"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-bold text-black mb-4 pb-3 border-b border-gray-200">
            📅 {{ formatDate(schedule.date) }}
          </h3>
          
          <div class="space-y-4">
            <div
              v-for="(meal, mealIdx) in schedule.meals"
              :key="mealIdx"
              class="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-4"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ getDayPartIcon(meal.dayPart) }}</span>
                <div>
                  <p class="text-xs text-gray-600 font-medium">{{ getDayPartLabel(meal.dayPart) }}</p>
                  <p class="text-lg font-bold text-black">{{ meal.foodName }}</p>
                </div>
              </div>
              
              <button
                @click="deleteMeal(meal.id)"
                class="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-colors"
                title="Odstrániť z plánu"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg">
        <span class="text-6xl">📅</span>
        <p class="text-gray-600 text-lg mt-4">Žiadne naplánované jedlá</p>
        <p class="text-gray-500 text-sm mt-2">Klikni na tlačidlo "Pridať jedlo" a začni plánovať</p>
      </div>
    </div>

    <!-- Meal Add Modal -->
    <MealAddModal
      :show="showAddModal"
      @close="closeAddModal"
      @success="onMealAdded"
    />
  </div>
</template>

<script>
import { mealScheduleAPI } from '../api/api-client';
import MealAddModal from '../components/MealAddModal.vue';

export default {
  name: 'MealSchedule',
  components: {
    MealAddModal,
  },
  data() {
    return {
      mealSchedules: [],
      fromDate: '',
      toDate: '',
      loading: false,
      showAddModal: false,
      refreshTrigger: 0,
    };
  },
  computed: {
    groupedSchedules() {
      // Zoskupenie jedál podľa dátumu
      const grouped = {};
      
      this.mealSchedules.forEach(schedule => {
        if (!grouped[schedule.date]) {
          grouped[schedule.date] = {
            date: schedule.date,
            meals: [],
          };
        }
        grouped[schedule.date].meals.push({
          id: schedule.id,
          dayPart: schedule.dayPart,
          foodName: schedule.food?.name || 'Neznáme jedlo',
        });
      });

      // Konverzia na pole a zoradenie podľa dátumu
      return Object.values(grouped).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
    },
  },
  watch: {
    fromDate() {
      this.loadMealSchedules();
    },
    toDate() {
      this.loadMealSchedules();
    },
    refreshTrigger() {
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
        const res = await mealScheduleAPI.get(
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
    getDayPartIcon(dayPart) {
      const icons = {
        RANAJKY: '🌅',
        DESIATA: '☕',
        OBED: '🍽️',
        OLOVRANT: '🍪',
        VECERA: '🌙',
        NESKORA_VECERA: '🌃',
      };
      return icons[dayPart] || '🍴';
    },
    getDayPartLabel(dayPart) {
      const labels = {
        RANAJKY: 'Raňajky',
        DESIATA: 'Desiata',
        OBED: 'Obed',
        OLOVRANT: 'Olovrant',
        VECERA: 'Večera',
        NESKORA_VECERA: 'Neskorá večera',
      };
      return labels[dayPart] || dayPart;
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    async onMealAdded() {
      this.refreshTrigger++;
      this.$store.dispatch('setSuccess', 'Jedlo bolo úspešne pridané do plánu');
    },
    async deleteMeal(mealId) {
      if (!confirm('Naozaj chceš odstrániť toto jedlo z plánu?')) {
        return;
      }

      try {
        await mealScheduleAPI.delete(mealId);
        this.refreshTrigger++;
        this.$store.dispatch('setSuccess', 'Jedlo bolo odstránené z plánu');
      } catch (error) {
        console.error('Chyba pri odstraňovaní jedla:', error);
        this.$store.dispatch('setError', 'Chyba pri odstraňovaní jedla z plánu');
      }
    },
  },
};
</script>

<style scoped>
</style>
