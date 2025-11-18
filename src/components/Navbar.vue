<template>
  <nav class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
          <span class="hidden sm:inline">🍳 ChefPad</span>
          <span class="sm:hidden">🍳</span>
        </router-link>

        <div class="hidden md:flex gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            {{ link.icon }} {{ link.label }}
          </router-link>
        </div>

        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          :aria-label="isOpen ? 'Zatvoriť menu' : 'Otvoriť menu'"
        >
          {{ isOpen ? '✕' : '☰' }}
        </button>
      </div>

      <div v-if="isOpen" class="md:hidden pb-4 space-y-2">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="isOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
        >
          {{ link.icon }} {{ link.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isOpen: false,
      navLinks: [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/foods', label: 'Jedlá', icon: '🍽️' },
        { path: '/ingredients', label: 'Ingrediencie', icon: '🥬' },
        { path: '/meal-schedule', label: 'Plán jedál', icon: '📅' },
        { path: '/shopping-list', label: 'Nákupný zoznam', icon: '🛒' },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
</style>
