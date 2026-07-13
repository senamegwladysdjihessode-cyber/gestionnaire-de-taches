<template>
  <div class="login-page d-flex justify-content-center align-items-center">

    <div class="card shadow p-4" style="width: 400px;">

      <h2 class="text-center mb-4">Connexion</h2>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login">

        <div class="mb-3">
          <label class="form-label">Email</label>

          <input
            type="email"
            class="form-control"
            placeholder="Entrez votre email"
            v-model="email"
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Mot de passe</label>

          <input
            type="password"
            class="form-control"
            placeholder="Entrez votre mot de passe"
            v-model="password"
          >
        </div>

        <button class="btn btn-primary w-100" type="submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <div class="text-center mt-3">
          <span>Pas encore de compte ? </span>
          <RouterLink to="/register">S'inscrire</RouterLink>
       </div>
      </form>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function login() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: var(--bg);
}

.card{
    border-radius:15px;
}
</style>