<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Mes projets</h1>
      <button class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Annuler' : '+ Nouveau projet' }}
      </button>
    </div>

    <!-- Formulaire de création -->
    <div v-if="showForm" class="card p-3 mb-4">
      <form @submit.prevent="createProject">
        <div class="mb-3">
          <label class="form-label">Nom du projet</label>
          <input type="text" class="form-control" v-model="newProject.name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" v-model="newProject.description"></textarea>
        </div>
        <button class="btn btn-success" type="submit" :disabled="loading">
          Créer le projet
        </button>
      </form>
    </div>

    <div v-if="loading">Chargement...</div>

    <!-- Vue normale (user) -->
    <div v-else-if="!authStore.isAdmin" class="projects-grid">
      <div class="card" v-for="project in projects" :key="project.id">
        <div class="card-body">
          <h5 class="card-title">{{ project.name }}</h5>
          <p class="card-text">{{ project.description }}</p>
          <p class="text-muted small">{{ project.tasks_count }} tâche(s)</p>

          <div class="d-flex gap-2">
            <RouterLink :to="`/projects/${project.id}`" class="btn btn-outline-primary btn-sm w-100">
              Voir les tâches
            </RouterLink>
            <button class="btn btn-outline-secondary btn-sm" @click="editProject(project)">
              Modifier
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteProject(project.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue groupée par utilisateur (admin) -->
    <div v-else>
      <div v-for="group in projectsByUser" :key="group.userId" class="mb-4">
        <h5 class="mb-3">{{ group.userName }}</h5>
        <div class="projects-grid">
          <div class="card" v-for="project in group.projects" :key="project.id">
            <div class="card-body">
              <h5 class="card-title">{{ project.name }}</h5>
              <p class="card-text">{{ project.description }}</p>
              <p class="text-muted small">{{ project.tasks_count }} tâche(s)</p>

              <div class="d-flex gap-2">
                <RouterLink :to="`/projects/${project.id}`" class="btn btn-outline-primary btn-sm w-100">
                  Voir les tâches
                </RouterLink>
                <button class="btn btn-outline-secondary btn-sm" @click="editProject(project)">
                  Modifier
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteProject(project.id)">
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

const projects = ref([])
const loading = ref(false)
const showForm = ref(false)

const newProject = ref({
  name: '',
  description: '',
})

async function fetchProjects() {
  loading.value = true
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de charger les projets', 'error')
  } finally {
    loading.value = false
  }
}

async function createProject() {
  loading.value = true
  try {
    const response = await api.post('/projects', newProject.value)
    projects.value.push({ ...response.data, tasks_count: 0 })
    newProject.value = { name: '', description: '' }
    showForm.value = false
    Swal.fire('Créé !', 'Le projet a été créé avec succès', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de créer le projet', 'error')
  } finally {
    loading.value = false
  }
}

async function deleteProject(id) {
  const result = await Swal.fire({
    title: 'Supprimer ce projet ?',
    text: 'Toutes les tâches associées seront également supprimées.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc3545',
  })

  if (!result.isConfirmed) return

  try {
    await api.delete(`/projects/${id}`)
    projects.value = projects.value.filter(p => p.id !== id)
    Swal.fire('Supprimé !', 'Le projet a été supprimé', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de supprimer le projet', 'error')
  }
}

onMounted(fetchProjects)
async function editProject(project) {
  const { value: formValues } = await Swal.fire({
    title: 'Modifier le projet',
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Nom" value="${project.name}">
      <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${project.description || ''}</textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      return {
        name: document.getElementById('swal-name').value,
        description: document.getElementById('swal-description').value,
      }
    }
  })

  if (!formValues) return

  try {
    const response = await api.put(`/projects/${project.id}`, formValues)
    const index = projects.value.findIndex(p => p.id === project.id)
    projects.value[index] = { ...response.data, tasks_count: project.tasks_count }
    Swal.fire('Modifié !', 'Le projet a été mis à jour', 'success')
  } catch (error) {
    Swal.fire('Erreur', 'Impossible de modifier le projet', 'error')
  }
}
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const projectsByUser = computed(() => {
  const groups = {}
  projects.value.forEach(project => {
    const userId = project.creator?.id ?? project.created_by
    const userName = project.creator?.name ?? 'Utilisateur inconnu'
    if (!groups[userId]) {
      groups[userId] = { userId, userName, projects: [] }
    }
    groups[userId].projects.push(project)
  })
  return Object.values(groups)
})
</script>

<style scoped>
.card-title {
  font-weight: 600;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.btn-primary{
  background-color: blanchedalmond;
  color: black;
}
</style>