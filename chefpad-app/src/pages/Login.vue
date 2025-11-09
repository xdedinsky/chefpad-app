<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
    <div class="text-center mb-8">
    <img src="../assets/logo.png" alt="ChefPad Logo" class="h-20 w-20 mx-auto" />
    <h1 class="text-3xl font-bold text-gray-800 mt-4">ChefPad</h1>
    <p class="text-gray-600 mt-2">Prihlásenie do účtu</p>
    </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="vas@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Heslo
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Prihlasovanie...' : 'Prihlásiť sa' }}
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Nemáte účet?
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-semibold">
            Zaregistrujte sa
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.loading = true;
      this.error = null;
      const result = await this.login(this.formData);
      if (result.success) {
        this.$router.push('/');
      } else {
        this.error = result.error;
      }
      this.loading = false;
    },
  },
};
</script>
