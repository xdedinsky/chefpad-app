<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- Compact Hero Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="text-center">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
          Vitaj v <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">ChefPad</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Profesionálny asistent pre plánovanie jedál, správu ingrediencií a nákupných zoznamov
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-blue-600 text-white py-6 sm:py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-2xl sm:text-3xl font-bold">{{ foods.length }}</p>
            <p class="text-blue-100 text-sm">Jedlá</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold">{{ allergens.length }}</p>
            <p class="text-blue-100 text-sm">Alergény</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold">∞</p>
            <p class="text-blue-100 text-sm">Možnosti</p>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-bold">24/7</p>
            <p class="text-blue-100 text-sm">K dispozícii</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">Funkcionality</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link
          v-for="feature in features"
          :key="feature.path"
          :to="feature.path"
          class="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transition-all hover:translate-y-[-4px] group"
        >
          <div class="mb-4 inline-block p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors text-2xl">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </router-link>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">Pripravený začať?</h2>
        <p class="text-blue-100 mb-6 text-base sm:text-lg">Explore all features a optimalizuj svoje varenie</p>
        <router-link
          to="/foods"
          class="inline-block bg-white text-blue-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
        >
          Objavuj jedlá →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { foodAPI, allergenAPI } from '../api/api-client';

export default {
  name: 'Home',
  data() {
    return {
      foods: [],
      allergens: [],
      loading: false,
      features: [
        {
          icon: '🍽️',
          title: 'Spravovať jedlá',
          description: 'Prehliadaj a spravuj databázu jedál',
          path: '/foods',
        },
        {
          icon: '🥬',
          title: 'Ingrediencie',
          description: 'Spravuj ingrediencie a alergény',
          path: '/ingredients',
        },
        {
          icon: '📅',
          title: 'Plán jedál',
          description: 'Plánovanie jedál na týždeň',
          path: '/meal-schedule',
        },
        {
          icon: '🛒',
          title: 'Nákupný zoznam',
          description: 'Vygeneruj nákupný zoznam',
          path: '/shopping-list',
        },
      ],
    };
  },
  async mounted() {
    await this.$nextTick();
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const [foodsRes, allergensRes] = await Promise.all([
          foodAPI.getAll(),
          allergenAPI.getAll(),
        ]);
        this.foods = foodsRes.data || [];
        this.allergens = allergensRes.data || [];
        this.$store.dispatch('setFoods', this.foods);
        this.$store.dispatch('setAllergens', this.allergens);
      } catch (error) {
        console.error('Chyba pri načítaní údajov:', error);
        this.foods = [];
        this.allergens = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
