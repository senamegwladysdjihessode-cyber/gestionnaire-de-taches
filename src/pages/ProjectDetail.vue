<template>
  <div>
    <RouterLink to="/projects" class="btn btn-outline-secondary btn-sm mb-3">
      ← Retour aux projets
    </RouterLink>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="project">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1>{{ project.name }}</h1>
          <p class="text-muted">{{ project.description }}</p>
        </div>
        <button class="btn-primary" @click="showForm = !showForm">
          {{ showForm ? 'Annuler' : '+ Nouvelle tâche' }}
        </button>
      </div>

      <!-- Formulaire de création de tâche -->
      <div v-if="showForm" class="card p-3 mb-4">
        <form @submit.prevent="createTask">
          <div class="mb-3">
            <label class="form-label">Titre</label>
            <input type="text" class="form-control" v-model="newTask.title" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="newTask.description"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Date d'échéance</label>
            <input type="date" class="form-control" v-model="newTask.due_date">
          </div>
          <button class="btn btn-success" type="submit" :disabled="creating">
            Créer la tâche
          </button>
        </form>
      </div>

      <h3 class="mt-4">Tâches du projet</h3>
      <div v-if="project.tasks.length === 0">Aucune tâche dans ce projet.</div>

      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="task in project.tasks" :key="task.id">
          <div>
            <strong>{{ task.title }}</strong>
            <p class="mb-0 text-muted small">{{ task.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const project = ref(null)
const loading = ref(false)
const creating = ref(false)
const showForm = ref(false)

const newTask = ref({
  title: '',
  description: '',
  due_date: '',
})

async function fetchProject() {
  loading.value = true
  try {
    const response = await api.get(`/projects/${route.params.id}`)
    project.value = response.data
  } finally {
    loading.value = false
  }
}

async function createTask() {
  creating.value = true
  try {
    const response = await api.post('/tasks', {
      ...newTask.value,
      project_id: route.params.id,
    })
    project.value.tasks.push(response.data)
    newTask.value = { title: '', description: '', due_date: '' }
    showForm.value = false
    Swal.fire('Créée !', 'La tâche a été ajoutée au projet', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de créer la tâche', 'error')
  } finally {
    creating.value = false
  }
}

onMounted(fetchProject)
</script>
<style>
  .btn-primary{
    background-color: blanchedalmond;
    color: black;
  }

</style>