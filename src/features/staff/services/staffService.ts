import { apiFetch } from '@/shared/api/client'
import type { RoleStaff, Staff } from '../types'

export function fetchStaff(magasinId: string): Promise<Staff[]> {
  return apiFetch<Staff[]>(`/staff?magasinId=${magasinId}`)
}

export function creerStaff(
  magasinId: string,
  email: string,
  motDePasse: string,
  role: RoleStaff
): Promise<Staff> {
  return apiFetch<Staff>(`/staff?magasinId=${magasinId}`, {
    method: 'POST',
    body: JSON.stringify({ email, motDePasse, role })
  })
}

export function supprimerStaff(magasinId: string, staffId: string): Promise<void> {
  return apiFetch<void>(`/staff/${staffId}?magasinId=${magasinId}`, {
    method: 'DELETE'
  })
}