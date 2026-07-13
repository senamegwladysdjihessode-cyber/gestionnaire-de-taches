<template>
  <div>
    <h1 class="mb-4">Tableau de bord</h1>

    <div v-if="loading">Chargement...</div>

    <div v-else>
      <!-- Stats personnelles -->
      <div class="stats-grid mb-4">
        <div class="stat-card">
          <div class="stat-number">{{ totalTasks }}</div>
          <div class="stat-label">Total de mes tâches</div>
        </div>

        <div class="stat-card todo">
          <div class="stat-number">{{ todoCount }}</div>
          <div class="stat-label">À faire</div>
        </div>

        <div class="stat-card in-progress">
          <div class="stat-number">{{ inProgressCount }}</div>
          <div class="stat-label">En cours</div>
        </div>

        <div class="stat-card done">
          <div class="stat-number">{{ doneCount }}</div>
          <div class="stat-label">Terminées</div>
        </div>
      </div>

      <!-- Stats globales (admin uniquement) -->
      <div v-if="authStore.isAdmin && adminStats">
        <h3 class="mb-3">Statistiques globales</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ adminStats.total_users }}</div>
            <div class="stat-label">Utilisateurs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ adminStats.total_tasks }}</div>
            <div class="stat-label">Tâches (tous users)</div>
          </div>
        </div>

        <h4 class="mt-4 mb-2">Tâches par utilisateur</h4>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between" v-for="u in adminStats.tasks_per_user" :key="u.id">
            {{ u.name }}
            <span class="badge bg-primary rounded-pill">{{ u.tasks_count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const tasks = ref([])
const adminStats = ref(null)
const loading = ref(false)

const totalTasks = computed(() => tasks.value.length)
const todoCount = computed(() => tasks.value.filter(t => t.status === 'todo').length)
const inProgressCount = computed(() => tasks.value.filter(t => t.status === 'in_progress').length)
const doneCount = computed(() => tasks.value.filter(t => t.status === 'done').length)

async function fetchTasks() {
  const response = await api.get('/tasks')
  tasks.value = response.data
}

async function fetchAdminStats() {
  const response = await api.get('/admin/stats')
  adminStats.value = response.data
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchTasks()
    if (authStore.isAdmin) {
      await fetchAdminStats()
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2563eb;
}

.stat-card.todo {
  border-left-color: #f59e0b;
}

.stat-card.in-progress {
  border-left-color: #3b82f6;
}

.stat-card.done {
  border-left-color: #22c55e;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  color: #64748b;
  margin-top: 5px;
}
</style>
