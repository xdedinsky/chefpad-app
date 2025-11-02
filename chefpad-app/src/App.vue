<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-2xl">👨‍🍳</span>
              <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ChefPad
              </span>
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              🏠 Domov
            </router-link>
            <router-link 
              to="/foods" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              🍽️ Jedlá
            </router-link>
            <router-link 
              to="/ingredients" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              🥬 Ingrediencie
            </router-link>
            <router-link 
              to="/meal-schedule" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              📅 Plán jedál
            </router-link>
            <router-link 
              to="/shopping-list" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              🛒 Nákupný zoznam
            </router-link>
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
            <router-link 
              to="/" 
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 font-semibold bg-blue-50"
            >
              🏠 Domov
            </router-link>
            <router-link 
              to="/foods" 
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 font-semibold bg-blue-50"
            >
              🍽️ Jedlá
            </router-link>
            <router-link 
              to="/ingredients" 
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 font-semibold bg-blue-50"
            >
              🥬 Ingrediencie
            </router-link>
            <router-link 
              to="/meal-schedule" 
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 font-semibold bg-blue-50"
            >
              📅 Plán jedál
            </router-link>
            <router-link 
              to="/shopping-list" 
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 font-semibold bg-blue-50"
            >
              🛒 Nákupný zoznam
            </router-link>
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
export default {
  name: 'App',
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  watch: {
    // Zatvor mobile menu pri zmene route
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
