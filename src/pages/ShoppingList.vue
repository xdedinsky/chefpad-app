<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">🛒</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-black">Nákupný zoznam</h1>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            ➕ Pridať položku
          </button>
        </div>
        <p class="text-gray-600">Zoznam ingrediencií na nákup</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">Načítavam nákupný zoznam...</p>
      </div>

      <!-- Shopping List Items -->
      <div v-else-if="shoppingList.length > 0" class="space-y-3">
        <div
          v-for="item in shoppingList"
          :key="item.id"
          class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <!-- Item Info -->
            <div class="flex items-center gap-4 flex-1">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <span class="text-2xl">🥗</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-black">
                  {{ item.ingredientName|| 'Neznáma ingrediencia' }}
                </h3>
                <p class="text-green-600 font-semibold text-lg">
                  {{ item.amount }} {{ item.unit }}
                </p>
              </div>
            </div>

            <!-- Delete Button -->
            <button
              @click="deleteItem(item.id)"
              class="text-red-600 hover:text-red-800 hover:bg-red-100 p-3 rounded-lg transition-colors"
              title="Odstrániť zo zoznamu"
            >
              <span class="text-2xl">🗑️</span>
            </button>
          </div>

          <!-- Allergens if any -->
          <div v-if="item.ingredient?.allergens && item.ingredient.allergens.length > 0" class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="allergen in item.ingredient.allergens"
                :key="allergen.id"
                class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                ⚠️ {{ allergen.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg">
        <span class="text-6xl">🛒</span>
        <p class="text-gray-600 text-lg mt-4">Nákupný zoznam je prázdny</p>
        <p class="text-gray-500 text-sm mt-2">Klikni na tlačidlo "Pridať položku" a začni pridávať ingrediencie</p>
      </div>

      <!-- Summary -->
      <div v-if="!loading && shoppingList.length > 0" class="mt-8 bg-green-50 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-black text-lg">
              <span class="font-bold text-green-600">{{ shoppingList.length }}</span> 
              {{ shoppingList.length === 1 ? 'položka' : (shoppingList.length < 5 ? 'položky' : 'položiek') }} 
              v zozname
            </p>
          </div>
          <button
            @click="clearAllItems"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            🗑️ Vymazať všetko
          </button>
        </div>
      </div>
    </div>

    <!-- Shopping List Add Modal -->
    <ShoppingListAddModal
      :show="showAddModal"
      @close="closeAddModal"
      @success="onItemAdded"
    />
  </div>
</template>

<script>
import { shoppingListAPI } from '../api/api-client';
import ShoppingListAddModal from '../components/ShoppingListAddModal.vue';

export default {
  name: 'ShoppingList',
  components: {
    ShoppingListAddModal,
  },
  data() {
    return {
      shoppingList: [],
      loading: false,
      showAddModal: false,
      refreshTrigger: 0,
    };
  },
  watch: {
    refreshTrigger() {
      this.loadShoppingList();
    },
  },
  mounted() {
    this.loadShoppingList();
  },
  methods: {
    async loadShoppingList() {
      try {
        this.loading = true;
        const res = await shoppingListAPI.get();
        this.shoppingList = res.data;
        this.$store.dispatch('setShoppingList', this.shoppingList);
      } catch (error) {
        console.error('Chyba pri načítaní nákupného zoznamu:', error);
        this.$store.dispatch('setError', 'Chyba pri načítaní nákupného zoznamu');
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    async onItemAdded() {
      this.refreshTrigger++;
      this.$store.dispatch('setSuccess', 'Položka bola úspešne pridaná do nákupného zoznamu');
    },
    async deleteItem(itemId) {
      if (!confirm('Naozaj chceš odstrániť túto položku z nákupného zoznamu?')) {
        return;
      }

      try {
        await shoppingListAPI.delete(itemId);
        this.refreshTrigger++;
        this.$store.dispatch('setSuccess', 'Položka bola odstránená z nákupného zoznamu');
      } catch (error) {
        console.error('Chyba pri odstraňovaní položky:', error);
        this.$store.dispatch('setError', 'Chyba pri odstraňovaní položky z nákupného zoznamu');
      }
    },
    async clearAllItems() {
      if (!confirm(`Naozaj chceš odstrániť všetkých ${this.shoppingList.length} položiek z nákupného zoznamu?`)) {
        return;
      }

      try {
        // Odstránenie všetkých položiek paralelne
        const deletePromises = this.shoppingList.map(item => 
          shoppingListAPI.delete(item.id)
        );
        await Promise.all(deletePromises);
        
        this.refreshTrigger++;
        this.$store.dispatch('setSuccess', 'Nákupný zoznam bol úspešne vymazaný');
      } catch (error) {
        console.error('Chyba pri mazaní nákupného zoznamu:', error);
        this.$store.dispatch('setError', 'Chyba pri mazaní nákupného zoznamu');
      }
    },
  },
};
</script>

<style scoped>
</style>
