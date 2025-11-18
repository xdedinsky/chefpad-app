<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <img src="../assets/logo.png" alt="ChefPad Logo" class="h-20 w-20 mx-auto" />
        <h1 class="text-3xl font-bold text-gray-800 mt-4">ChefPad</h1>
        <p class="text-gray-600 mt-2">Vytvorenie nového účtu</p>
    </div>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Meno</label>
          <input 
            id="name" 
            v-model="formData.name" 
            type="text" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" 
            placeholder="Vaše meno" 
          />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Priezvisko</label>
          <input 
            id="lastName" 
            v-model="formData.lastName" 
            type="text" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" 
            placeholder="Vaše priezvisko" 
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Heslo</label>
          <input 
            id="password" 
            v-model="formData.password" 
            type="password" 
            required 
            minlength="6" 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" 
            placeholder="••••••••" 
          />
          <p class="text-xs text-gray-500 mt-1">Minimálne 6 znakov</p>
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Potvrdenie hesla</label>
          <input 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            type="password" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900" 
            placeholder="••••••••" 
          />
        </div>
        <button 
          type="submit" 
          :disabled="loading || !passwordsMatch" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Registrácia...' : 'Zaregistrovať sa' }}
        </button>
        <p v-if="!passwordsMatch && formData.confirmPassword" class="text-red-600 text-sm">Heslá sa nezhodujú</p>
      </form>
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Už máte účet?
          <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
            Prihláste sa
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        name: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      error: null,
    };
  },
  computed: {
    passwordsMatch() {
      return this.formData.password === this.formData.confirmPassword;
    },
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      if (!this.passwordsMatch) {
        this.error = 'Heslá sa nezhodujú';
        return;
      }
      this.loading = true;
      this.error = null;
      const { confirmPassword, ...registerData } = this.formData;
      const result = await this.register(registerData);
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
