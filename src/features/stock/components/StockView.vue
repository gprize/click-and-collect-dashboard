<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { importerStock, type LigneImport, type ImportResponse } from '../services/stockService'
import { useSessionStore } from '@/stores/session'
import { ApiError } from '@/shared/api/client'

const session = useSessionStore()

const lignesApercu = ref<LigneImport[]>([])
const lignesInvalides = ref<{ ligne: number; raison: string }[]>([])
const nomFichier = ref<string | null>(null)
const importEnCours = ref(false)
const resultat = ref<ImportResponse | null>(null)
const erreur = ref<string | null>(null)

function reinitialiser() {
  lignesApercu.value = []
  lignesInvalides.value = []
  resultat.value = null
  erreur.value = null
}

async function handleFichier(event: Event) {
  reinitialiser()
  const input = event.target as HTMLInputElement
  const fichier = input.files?.[0]
  if (!fichier) return

  nomFichier.value = fichier.name

  try {
    const buffer = await fichier.arrayBuffer()
    const classeur = XLSX.read(buffer, { type: 'array' })

    const premierNomFeuille = classeur.SheetNames[0]
    if (!premierNomFeuille) {
      erreur.value = 'Le fichier Excel ne contient aucune feuille'
      return
    }
    const feuille = classeur.Sheets[premierNomFeuille]
    if (!feuille) {
      erreur.value = 'Le fichier Excel ne contient aucune feuille'
      return
    }
    const lignesBrutes = XLSX.utils.sheet_to_json<Record<string, unknown>>(feuille)

    const valides: LigneImport[] = []
    const invalides: { ligne: number; raison: string }[] = []

    lignesBrutes.forEach((ligne, index) => {
      const nom = String(ligne.nom ?? '').trim()
      const prix = Number(ligne.prix)
      const quantiteStock = Number(ligne.quantiteStock)

      if (!nom) {
        invalides.push({ ligne: index + 2, raison: 'Nom manquant' })
      } else if (isNaN(prix) || prix < 0) {
        invalides.push({ ligne: index + 2, raison: 'Prix invalide' })
      } else if (isNaN(quantiteStock) || quantiteStock < 0 || !Number.isInteger(quantiteStock)) {
        invalides.push({ ligne: index + 2, raison: 'Quantité invalide' })
      } else {
        valides.push({ nom, prix, quantiteStock })
      }
    })

    lignesApercu.value = valides
    lignesInvalides.value = invalides
  } catch {
    erreur.value = "Impossible de lire ce fichier. Vérifiez qu'il s'agit bien d'un fichier Excel (.xlsx)."
  }

  input.value = ''
}

async function confirmerImport() {
  importEnCours.value = true
  erreur.value = null
  try {
    resultat.value = await importerStock(session.magasinId, lignesApercu.value)
    lignesApercu.value = []
  } catch (e) {
    erreur.value = e instanceof ApiError ? e.message : "Erreur lors de l'import"
  } finally {
    importEnCours.value = false
  }
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-2">Stock</h1>
    <p class="text-body-2 mb-6" style="color: var(--color-muted)">
      Déposez un fichier Excel (.xlsx) avec les colonnes <strong>nom</strong>, <strong>prix</strong>,
      <strong>quantiteStock</strong> pour créer ou mettre à jour vos produits en une fois.
    </p>

    <v-card class="pa-6 mb-6" variant="tonal">
      <v-file-input
        label="Cliquez pour selectionner un fichier ou glissez-déposez ici"
        accept=".xlsx"
        prepend-icon="mdi-file-excel-outline"
        variant="outlined"
        hide-details
        @change="handleFichier"
      />
    </v-card>

    <v-alert v-if="erreur" type="error" :text="erreur" class="mb-4" />

    <v-alert
      v-if="resultat"
      type="success"
      class="mb-4"
      :text="`Import terminé : ${resultat.nombreCrees} produit(s) créé(s), ${resultat.nombreMisAJour} mis à jour.`"
    />

    <template v-if="lignesApercu.length > 0 || lignesInvalides.length > 0">
      <div class="d-flex justify-space-between align-center mb-3">
        <h2 class="text-subtitle-1">Aperçu — {{ nomFichier }}</h2>
        <v-btn
          color="primary"
          variant="flat"
          :loading="importEnCours"
          :disabled="lignesApercu.length === 0"
          @click="confirmerImport"
        >
          Confirmer l'import ({{ lignesApercu.length }} ligne(s))
        </v-btn>
      </div>

      <v-alert
        v-if="lignesInvalides.length > 0"
        type="warning"
        variant="tonal"
        class="mb-4"
      >
        {{ lignesInvalides.length }} ligne(s) ignorée(s) :
        <div v-for="(inv, i) in lignesInvalides" :key="i" class="text-caption">
          Ligne {{ inv.ligne }} — {{ inv.raison }}
        </div>
      </v-alert>

      <v-table v-if="lignesApercu.length > 0" density="comfortable">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ligne, i) in lignesApercu" :key="i">
            <td>{{ ligne.nom }}</td>
            <td class="prix">{{ ligne.prix.toLocaleString('fr-FR') }} FCFA</td>
            <td>{{ ligne.quantiteStock }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </v-container>
</template>