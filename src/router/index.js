import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

import Dashboard from '../pages/Dashboard.vue'
import Projects from '../pages/Projects.vue'
import Tasks from '../pages/Tasks.vue'
import AdminUsers from '../pages/AdminUsers.vue'
import ProjectDetail from '../pages/ProjectDetail.vue'
import Welcome from '../pages/Welcome.vue'

import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          component: Dashboard
        },
        {
          path: 'projects',
          component: Projects
        },
        {
          path: 'tasks',
          component: Tasks
        },
        {
          path: 'admin/users',
          component: AdminUsers,
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
         path: 'projects/:id',
         component: ProjectDetail,
         meta: { requiresAuth: true }
        },
        {
         path: '',
          component: Welcome
         },
  
      ]
    }
  ]
})

// Garde de navigation : bloque l'accès si pas connecté
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router