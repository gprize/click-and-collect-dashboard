import { apiFetch } from '@/shared/api/client'

export interface LigneImport {
  nom: string
  prix: number
  quantiteStock: number
}

export interface ImportResponse {
  nombreCrees: number
  nombreMisAJour: number
}

export function importerStock(magasinId: string, lignes: LigneImport[]): Promise<ImportResponse> {
  return apiFetch<ImportResponse>('/produits/import', {
    method: 'POST',
    body: JSON.stringify({ magasinId, lignes })
  })
}