<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">🛒</span>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Nákupný zoznam</h1>
        </div>
        <p class="text-gray-600">Zoznam všetkých potrebných ingrediencií</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <button
          @click="handlePrint"
          class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🖨️ Tlačiť
        </button>
        <button
          @click="handleDownloadCSV"
          class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          💾 Sťahovať CSV
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p class="mt-4 text-gray-600">Načítavam nákupný zoznam...</p>
      </div>

      <!-- Shopping List Table -->
      <div v-else-if="shoppingList.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-orange-50 border-b-2 border-orange-200">
              <tr>
                <th class="px-6 py-3 text-left font-bold text-gray-900">Ingrediencia</th>
                <th class="px-6 py-3 text-left font-bold text-gray-900">Množstvo</th>
                <th class="px-6 py-3 text-left font-bold text-gray-900">Jednotka</th>
                <th class="px-6 py-3 text-left font-bold text-gray-900">Alergény</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in shoppingList" :key="idx" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="px-6 py-4 text-gray-900 font-medium">{{ item.ingredient.name }}</td>
                <td class="px-6 py-4 text-gray-700">{{ item.quantity }}</td>
                <td class="px-6 py-4 text-gray-700">{{ item.unit }}</td>
                <td class="px-6 py-4">
                  <div
                    v-if="item.ingredient.allergens && item.ingredient.allergens.length > 0"
                    class="flex flex-wrap gap-2"
                  >
                    <span
                      v-for="allergen in item.ingredient.allergens"
                      :key="allergen.id"
                      class="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      ⚠️ {{ allergen.name }}
                    </span>
                  </div>
                  <span v-else class="text-gray-500">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="bg-orange-50 border-t-2 border-orange-200 px-6 py-4">
          <p class="text-gray-700 font-medium">
            Celkovo: <span class="text-orange-600 font-bold">{{ shoppingList.length }}</span> ingrediencií
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg">
        <span class="text-6xl">🛒</span>
        <p class="text-gray-600 text-lg mt-4">Nákupný zoznam je prázdny</p>
      </div>
    </div>
  </div>
</template>

<script>
import { shoppingListAPI } from '../api/api-client';

export default {
  name: 'ShoppingList',
  data() {
    return {
      shoppingList: [],
      loading: false,
    };
  },
  mounted() {
    this.loadShoppingList();
  },
  methods: {
    async loadShoppingList() {
      try {
        this.loading = true;
        const userId = this.$store.getters.getCurrentUserId;
        const res = await shoppingListAPI.get(userId);
        this.shoppingList = res.data;
        this.$store.dispatch('setShoppingList', this.shoppingList);
      } catch (error) {
        console.error('Chyba pri načítaní nákupného zoznamu:', error);
        this.$store.dispatch('setError', 'Chyba pri načítaní nákupného zoznamu');
      } finally {
        this.loading = false;
      }
    },
    handlePrint() {
      window.print();
    },
    handleDownloadCSV() {
      const csv = [
        ['Ingrediencia', 'Množstvo', 'Jednotka', 'Alergény'],
        ...this.shoppingList.map(item => [
          item.ingredient.name,
          item.quantity,
          item.unit,
          item.ingredient.allergens?.map(a => a.name).join(', ') || 'Žiadne',
        ]),
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nakupny-zoznam.csv';
      a.click();
    },
  },
};
</script>

<style scoped>
</style>
