<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Gestion des utilisateurs</h1>
      <button class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : '+ Nouvel utilisateur' }}
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <!-- Formulaire de création -->
    <div v-if="showForm" class="card p-3 mb-4">
      <form @submit.prevent="createUser">
        <div class="mb-3">
          <label class="form-label">Nom</label>
          <input type="text" class="form-control" v-model="newUser.name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="newUser.email" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mot de passe</label>
          <input type="password" class="form-control" v-model="newUser.password" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Rôle</label>
          <select class="form-select" v-model="newUser.role">
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <button class="btn btn-success" type="submit" :disabled="loading">
          Créer l'utilisateur
        </button>
      </form>
    </div>

    <!-- Liste des utilisateurs -->
    <table class="table table-hover bg-white">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select class="form-select form-select-sm" v-model="user.role" @change="updateRole(user)">
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline-danger btn-sm" @click="deleteUser(user.id)">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Swal from 'sweetalert2'

const users = ref([])
const loading = ref(false)
const showForm = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
})

async function fetchUsers() {
  loading.value = true
  try {
    const response = await api.get('/admin/users')
    users.value = response.data
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de charger les utilisateurs', 'error')
  } finally {
    loading.value = false
  }
}

async function createUser() {
  loading.value = true
  try {
    const response = await api.post('/admin/users', newUser.value)
    users.value.push(response.data)
    newUser.value = { name: '', email: '', password: '', role: 'user' }
    showForm.value = false
    Swal.fire('Créé !', "L'utilisateur a été créé avec succès", 'success')
  } catch (error) {
    const message = error.response?.data
      ? Object.values(error.response.data).flat().join(' ')
      : "Impossible de créer l'utilisateur"
    Swal.fire('Erreur', message, 'error')
  } finally {
    loading.value = false
  }
}

async function updateRole(user) {
  try {
    await api.put(`/admin/users/${user.id}`, { role: user.role })
    Swal.fire({
      icon: 'success',
      title: 'Rôle mis à jour',
      timer: 1200,
      showConfirmButton: false,
    })
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de mettre à jour le rôle', 'error')
  }
}

async function deleteUser(id) {
  const result = await Swal.fire({
    title: 'Supprimer cet utilisateur ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc3545',
  })

  if (!result.isConfirmed) return

  try {
    await api.delete(`/admin/users/${id}`)
    users.value = users.value.filter(u => u.id !== id)
    Swal.fire('Supprimé !', "L'utilisateur a été supprimé", 'success')
  } catch (error) {
    Swal.fire('Erreur', "Impossible de supprimer l'utilisateur", 'error')
  }
}

onMounted(fetchUsers)
</script>
<style scoped>
  .btn-primary{
  background-color: blanchedalmond;
  color: black;
  }
</style>