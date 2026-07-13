<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Mes tâches</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : '+ Nouvelle tâche' }}
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <!-- Formulaire de création -->
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
        <div class="mb-3">
          <label class="form-label">Projet (optionnel)</label>
          <select class="form-select" v-model="newTask.project_id">
            <option :value="null">Aucun projet</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
        <button class="btn btn-success" type="submit" :disabled="loading">
          Créer la tâche
        </button>
      </form>
    </div>

    <div v-if="loading">Chargement...</div>

    <!-- Vue normale (user) -->
    <div v-else-if="!authStore.isAdmin" class="tasks-grid">
      <div class="card h-100" v-for="task in tasks" :key="task.id">
        <div class="card-body">
          <h5 class="card-title">{{ task.title }}</h5>
          <p class="card-text">{{ task.description }}</p>
          <p v-if="task.due_date" class="text-muted small">
            Échéance : {{ task.due_date }}
          </p>

          <select class="form-select mb-2" v-model="task.status" @change="updateStatus(task)">
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
          </select>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm w-100" @click="editTask(task)">
              Modifier
            </button>
            <button class="btn btn-outline-danger btn-sm w-100" @click="deleteTask(task.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue groupée par utilisateur (admin) -->
    <div v-else>
      <div v-for="group in tasksByUser" :key="group.userId" class="mb-4">
        <h5 class="mb-3">{{ group.userName }}</h5>
        <div class="tasks-grid">
          <div class="card h-100" v-for="task in group.tasks" :key="task.id">
            <div class="card-body">
              <h5 class="card-title">{{ task.title }}</h5>
              <p class="card-text">{{ task.description }}</p>
              <p v-if="task.due_date" class="text-muted small">
                Échéance : {{ task.due_date }}
              </p>

              <select class="form-select mb-2" v-model="task.status" @change="updateStatus(task)">
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>

              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm w-100" @click="editTask(task)">
                  Modifier
                </button>
                <button class="btn btn-outline-danger btn-sm w-100" @click="deleteTask(task.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Swal from 'sweetalert2'

const tasks = ref([])
const projects = ref([])
const loading = ref(false)
const showForm = ref(false)

const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  project_id: null,
})

async function fetchTasks() {
  loading.value = true
  try {
    const response = await api.get('/tasks')
    tasks.value = response.data
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de charger les tâches', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchProjects() {
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    // silencieux, non bloquant pour l'affichage des tâches
  }
}

async function createTask() {
  loading.value = true
  try {
    const response = await api.post('/tasks', newTask.value)
    tasks.value.push(response.data)
    newTask.value = { title: '', description: '', due_date: '', project_id: null }
    showForm.value = false
    Swal.fire('Créée !', 'La tâche a été créée avec succès', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de créer la tâche', 'error')
  } finally {
    loading.value = false
  }
}

async function updateStatus(task) {
  try {
    await api.put(`/tasks/${task.id}`, { status: task.status })
    Swal.fire({
      icon: 'success',
      title: 'Statut mis à jour',
      timer: 1200,
      showConfirmButton: false,
    })
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de mettre à jour le statut', 'error')
  }
}

async function deleteTask(id) {
  const result = await Swal.fire({
    title: 'Supprimer cette tâche ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc3545',
  })

  if (!result.isConfirmed) return

  try {
    await api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter(t => t.id !== id)
    Swal.fire('Supprimée !', 'La tâche a été supprimée', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de supprimer la tâche', 'error')
  }
}

onMounted(() => {
  fetchTasks()
  fetchProjects()
})

async function editTask(task) {
  const { value: formValues } = await Swal.fire({
    title: 'Modifier la tâche',
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Titre" value="${task.title}">
      <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${task.description || ''}</textarea>
      <input id="swal-due_date" type="date" class="swal2-input" value="${task.due_date || ''}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      return {
        title: document.getElementById('swal-title').value,
        description: document.getElementById('swal-description').value,
        due_date: document.getElementById('swal-due_date').value || null,
      }
    }
  })

  if (!formValues) return

  try {
    const response = await api.put(`/tasks/${task.id}`, formValues)
    const index = tasks.value.findIndex(t => t.id === task.id)
    tasks.value[index] = response.data
    Swal.fire('Modifiée !', 'La tâche a été mise à jour', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de modifier la tâche', 'error')
  }
}
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const tasksByUser = computed(() => {
  const groups = {}
  tasks.value.forEach(task => {
    const userId = task.user?.id ?? task.user_id
    const userName = task.user?.name ?? 'Utilisateur inconnu'
    if (!groups[userId]) {
      groups[userId] = { userId, userName, tasks: [] }
    }
    groups[userId].tasks.push(task)
  })
  return Object.values(groups)
})
</script>

<style scoped>
.card-title {
  font-weight: 600;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.btn-primary{
  background-color: blanchedalmond;
  color: black;
}
</style>