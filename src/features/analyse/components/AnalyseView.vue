<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchVentesParJour, fetchProduitsPopulaires, fetchVentesParJourSemaine } from '../services/analyseService'
import { useSessionStore } from '@/stores/session'
import { useMagasinStore } from '@/stores/magasin'
import GrapheVentes from './GrapheVentes.vue'
import GrapheProduitsPopulaires from './GrapheProduitsPopulaires.vue'
import GrapheRepartitionSemaine from './GrapheRepartitionSemaine.vue'
import type { ProduitVendu, VenteParJour, JourSemaineVente } from '../types'

const session = useSessionStore()
const magasinStore = useMagasinStore()

const JOURS = 14

const ventes = ref<VenteParJour[]>([])
const produits = ref<ProduitVendu[]>([])
const repartitionSemaine = ref<JourSemaineVente[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)

const totalPeriode = computed(() => ventes.value.reduce((sum, v) => sum + v.total, 0))

onMounted(async () => {
  try {
    const [ventesData, produitsData, repartitionData] = await Promise.all([
      fetchVentesParJour(session.magasinId, JOURS),
      fetchProduitsPopulaires(session.magasinId, 5),
      fetchVentesParJourSemaine(session.magasinId)
    ])
    ventes.value = ventesData
    produits.value = produitsData
    repartitionSemaine.value = repartitionData
  } catch {
    erreur.value = 'Impossible de charger les statistiques'
  } finally {
    chargement.value = false
  }
})
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-6">Analyses</h1>

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <template v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-subtitle-1">Chiffre d'affaires — 14 derniers jours</h2>
              <span class="prix text-h6 text-primary">{{ totalPeriode.toLocaleString('fr-FR') }} FCFA</span>
            </div>
            <GrapheVentes
              :ventes="ventes"
              :jours="JOURS"
              :couleur-primaire="magasinStore.magasin?.couleurPrimaire ?? '#3B6B3E'"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <h2 class="text-subtitle-1 mb-4">Produits les plus vendus</h2>
            <GrapheProduitsPopulaires
            v-if="produits.length > 0"
            :produits="produits"
            :couleur-primaire="magasinStore.magasin?.couleurPrimaire ?? '#3B6B3E'"
            :couleur-secondaire="magasinStore.magasin?.couleurSecondaire ?? '#B23A2E'"
            />
            <p v-else class="text-body-2 text-center mt-8" style="color: var(--color-muted)">
              Aucune vente enregistrée pour l'instant
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-2 justify-center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-4">
            <h2 class="text-subtitle-1 mb-4">Répartition des ventes par jour de la semaine</h2>
            <GrapheRepartitionSemaine
              v-if="repartitionSemaine.some(j => j.total > 0)"
              :donnees="repartitionSemaine"
              :couleur-primaire="magasinStore.magasin?.couleurPrimaire ?? '#3B6B3E'"
            />
            <p v-else class="text-body-2 text-center mt-8" style="color: var(--color-muted)">
              Pas assez de données pour cette analyse
            </p>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>