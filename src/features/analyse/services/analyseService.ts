import { apiFetch } from '@/shared/api/client'
import type { JourSemaineVente, ProduitVendu, VenteParJour } from '../types'

export function fetchVentesParJour(magasinId: string, jours = 14): Promise<VenteParJour[]> {
  return apiFetch<VenteParJour[]>(`/analyses/ventes?magasinId=${magasinId}&jours=${jours}`)
}

export function fetchProduitsPopulaires(magasinId: string, limite = 5): Promise<ProduitVendu[]> {
  return apiFetch<ProduitVendu[]>(`/analyses/produits-populaires?magasinId=${magasinId}&limite=${limite}`)
}

export function fetchVentesParJourSemaine(magasinId: string, jours = 90): Promise<JourSemaineVente[]> {
  return apiFetch<JourSemaineVente[]>(`/analyses/ventes-par-jour-semaine?magasinId=${magasinId}&jours=${jours}`)
}