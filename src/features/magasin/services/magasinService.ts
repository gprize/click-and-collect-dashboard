import { apiFetch } from '@/shared/api/client'
import type { Magasin } from '../types'

export function fetchMagasinById(id: string): Promise<Magasin> {
  return apiFetch<Magasin>(`/magasins/${id}`)
}