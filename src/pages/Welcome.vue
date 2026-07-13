<template>
  <div class="welcome">
    <h1>Bienvenue, {{ authStore.user?.name }} 👋</h1>
    <p class="subtitle">Que souhaites-tu faire aujourd'hui ?</p>

    <div class="quick-links">
      <RouterLink to="/dashboard" class="quick-card">
        <h3>Tableau de bord</h3>
        <p>Vue d'ensemble de tes tâches et statistiques</p>
      </RouterLink>

      <RouterLink to="/projects" class="quick-card">
        <h3>Projets</h3>
        <p>Gérer tes projets en cours</p>
      </RouterLink>

      <RouterLink to="/tasks" class="quick-card">
        <h3>Tâches</h3>
        <p>Consulter et créer des tâches</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.welcome {
  max-width: 800px;
}

h1 {
  margin-bottom: 4px;
}

.subtitle {
  color: var(--muted);
  margin-bottom: 32px;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.quick-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: var(--ink);
  transition: all 0.15s ease;
}

.quick-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.quick-card h3 {
  color: var(--accent);
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.quick-card p {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0;
}
</style>