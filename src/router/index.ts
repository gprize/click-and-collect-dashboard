import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/features/auth/components/LoginView.vue'
import DashboardView from '@/features/dashboard/components/DashboardView.vue'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'dashboard', component: DashboardView }
  ]
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.name !== 'login' && !session.estConnecte()) {
    return { name: 'login' }
  }
})

export default router