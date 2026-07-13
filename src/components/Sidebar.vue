<template>
    <aside class="sidebar">

        <h2>Task Manager</h2>

        <nav class="nav-links">
            <RouterLink to="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="9"/>
                    <rect x="14" y="3" width="7" height="5"/>
                    <rect x="14" y="12" width="7" height="9"/>
                    <rect x="3" y="16" width="7" height="5"/>
                </svg>
                Dashboard
            </RouterLink>

            <RouterLink to="/projects">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                Projets
            </RouterLink>

            <RouterLink to="/tasks">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Tâches
            </RouterLink>

            <RouterLink to="/admin/users" v-if="authStore.isAdmin">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Utilisateurs
            </RouterLink>
        </nav>

        <button class="logout-btn" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
        </button>

    </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

function handleLogout() {
    authStore.logout()
}
</script>

<style scoped>
.sidebar{
    width:260px;
    background: lightslategrey;
    color: black;

    display:flex;
    flex-direction:column;

    padding:24px 18px;
}

h2 {
  color: var(--bg) !important;
  font-size: 1.25rem;
  margin: 0 0 28px 6px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

a{
    display: flex;
    align-items: center;
    gap: 12px;
    color: #C9BEA9;
    text-decoration:none;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.15s ease;
}

a svg {
  flex-shrink: 0;
  opacity: 0.8;
}

a:hover {
  background: rgba(255,255,255,0.06);
  color: var(--bg);
}

a.router-link-active{
    font-weight:600;
    color: var(--accent);
    background: rgba(184, 134, 46, 0.12);
}

a.router-link-active svg {
  opacity: 1;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #C9BEA9;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  background: #B04A3F;
  border-color: #B04A3F;
  color: white;
}
</style>