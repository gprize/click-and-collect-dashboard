import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthResponse } from '@/features/auth/services/authService'

const MAGASIN_ID = import.meta.env.VITE_MAGASIN_ID as string

export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const role = ref<string | null>(localStorage.getItem('role'))
  const magasinId = MAGASIN_ID

  function definirSession(auth: AuthResponse) {
    token.value = auth.token
    role.value = auth.role
    localStorage.setItem('token', auth.token)
    localStorage.setItem('role', auth.role)
  }

  function deconnecter() {
    token.value = null
    role.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const estConnecte = () => token.value !== null

  return { token, role, magasinId, definirSession, deconnecter, estConnecte }
})