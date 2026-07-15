import { apiFetch } from '@/shared/api/client'
import type { CommandeResponse } from '../types'

export function fetchCommandesMagasin(magasinId: string): Promise<CommandeResponse[]> {
  return apiFetch<CommandeResponse[]>(`/commandes?magasinId=${magasinId}`)
}

export function demarrerPreparation(commandeId: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>(`/commandes/${commandeId}/demarrer-preparation`, {
    method: 'PATCH'
  })
}

export function marquerPrete(commandeId: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>(`/commandes/${commandeId}/marquer-prete`, {
    method: 'PATCH'
  })
}

export function validerRecuperation(magasinId: string, codeRetrait: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>('/commandes/recuperation', {
    method: 'POST',
    body: JSON.stringify({ magasinId, codeRetrait })
  })
}