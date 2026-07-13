<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">

    <div class="card shadow p-4" style="width: 400px;">

      <h2 class="text-center mb-4">Inscription</h2>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="register">

        <div class="mb-3">
          <label class="form-label">Nom</label>
          <input
            type="text"
            class="form-control"
            placeholder="Entrez votre nom"
            v-model="name"
          >
        </div>

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

        <div class="mb-3">
          <label class="form-label">Confirmer le mot de passe</label>
          <input
            type="password"
            class="form-control"
            placeholder="Confirmez votre mot de passe"
            v-model="password_confirmation"
          >
        </div>

        <button class="btn btn-primary w-100" type="submit" :disabled="loading">
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>

      </form>

      <div class="text-center mt-3">
        <span>Déjà un compte ? </span>
        <RouterLink to="/login">Se connecter</RouterLink>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function register() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.data) {
      const errors = error.response.data
      errorMessage.value = Object.values(errors).flat().join(' ')
    } else {
      errorMessage.value = "Erreur lors de l'inscription"
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.card{
    border-radius:15px;
}

</style>