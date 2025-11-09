<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <img src="../src/assets/logo.png" alt="ChefPad Logo" class="h-14 w-14" />
              <span class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ChefPad
              </span>
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <template v-if="isAuthenticated">
              <router-link 
                to="/" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                🏠 Domov
              </router-link>
              <router-link 
                to="/foods" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                🍽️ Jedlá
              </router-link>
              <router-link 
                to="/ingredients" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                🥬 Ingrediencie
              </router-link>
              <router-link 
                to="/meal-schedule" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                📅 Plán jedál
              </router-link>
              <router-link 
                to="/shopping-list" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                🛒 Nákupný zoznam
              </router-link>
              <button 
                @click="handleLogout"
                class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                🚪 Odhlásiť sa
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                🔐 Prihlásiť sa
              </router-link>
              <router-link 
                to="/register" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
              >
                ✨ Registrácia
              </router-link>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  v-if="!mobileMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <template v-if="isAuthenticated">
              <router-link 
                to="/" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                🏠 Domov
              </router-link>
              <router-link 
                to="/foods" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                🍽️ Jedlá
              </router-link>
              <router-link 
                to="/ingredients" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                🥬 Ingrediencie
              </router-link>
              <router-link 
                to="/meal-schedule" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                📅 Plán jedál
              </router-link>
              <router-link 
                to="/shopping-list" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                🛒 Nákupný zoznam
              </router-link>
              <button 
                @click="handleLogout"
                class="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors w-full text-left"
              >
                🚪 Odhlásiť sa
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                @click="mobileMenuOpen = false"
                class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors"
                active-class="text-blue-600 font-semibold bg-blue-50"
              >
                🔐 Prihlásiť sa
              </router-link>
              <router-link 
                to="/register" 
                @click="mobileMenuOpen = false"
                class="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-lg font-medium transition-colors text-center"
              >
                ✨ Registrácia
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
      this.mobileMenuOpen = false;
    }
  },
  watch: {
    $route() {
      this.mobileMenuOpen = false;
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
