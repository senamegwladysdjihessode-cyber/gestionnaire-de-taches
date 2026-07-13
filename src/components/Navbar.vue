<template>
    <header class="navbar">
        <h2>Gestion des tâches</h2>
        <span class="user-name">{{ authStore.user?.name }}</span>
    </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.navbar{
    height:70px;
    background: bisque;
    color: black;
    border-bottom: 1px solid var(--border);

    display:flex;
    justify-content:space-between;
    align-items:center;

    padding:0 20px;
}

h2 {
  font-size: 1.2rem;
  margin: 0;
}

.user-name {
  color: var(--muted);
  font-weight: 500;
}
</style>