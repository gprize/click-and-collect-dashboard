<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchStaff, creerStaff, supprimerStaff } from '../services/staffService'
import { useSessionStore } from '@/stores/session'
import { ApiError } from '@/shared/api/client'
import type { RoleStaff, Staff } from '../types'

const session = useSessionStore()

const equipe = ref<Staff[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)

const email = ref('')
const motDePasse = ref('')
const role = ref<RoleStaff>('EMPLOYE')
const creationEnCours = ref(false)
const erreurCreation = ref<string | null>(null)

const suppressionEnCours = ref<string | null>(null)

async function charger() {
  chargement.value = true
  try {
    equipe.value = await fetchStaff(session.magasinId)
  } catch {
    erreur.value = 'Impossible de charger les comptes'
  } finally {
    chargement.value = false
  }
}

onMounted(charger)

async function handleCreer() {
  erreurCreation.value = null
  if (motDePasse.value.length < 8) {
    erreurCreation.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  creationEnCours.value = true
  try {
    await creerStaff(session.magasinId, email.value, motDePasse.value, role.value)
    email.value = ''
    motDePasse.value = ''
    role.value = 'EMPLOYE'
    await charger()
  } catch (e) {
    erreurCreation.value = e instanceof ApiError ? e.message : 'Erreur lors de la création'
  } finally {
    creationEnCours.value = false
  }
}

async function handleSupprimer(staffId: string) {
  suppressionEnCours.value = staffId
  try {
    await supprimerStaff(session.magasinId, staffId)
    await charger()
  } catch {
    erreur.value = 'Impossible de supprimer ce compte'
  } finally {
    suppressionEnCours.value = null
  }
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-6">Équipe</h1>

    <v-card class="pa-6 mb-8" variant="tonal">
      <h2 class="text-subtitle-1 mb-4">Ajouter un membre</h2>
      <v-form @submit.prevent="handleCreer">
        <v-text-field v-model="email" label="Email" type="email" class="mb-2" />
        <v-text-field v-model="motDePasse" label="Mot de passe" type="password" class="mb-2" />
        <v-select
          v-model="role"
          :items="[
            { title: 'Employé', value: 'EMPLOYE' },
            { title: 'Administrateur', value: 'ADMIN_MAGASIN' }
          ]"
          item-title="title"
          item-value="value"
          label="Rôle"
          class="mb-4"
        />
        <v-alert v-if="erreurCreation" type="error" :text="erreurCreation" class="mb-4" />
        <v-btn type="submit" color="primary" variant="flat" :loading="creationEnCours">
          Créer le compte
        </v-btn>
      </v-form>
    </v-card>

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <v-list v-else lines="two">
      <v-list-item v-for="membre in equipe" :key="membre.id">
        <v-list-item-title>{{ membre.email }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ membre.role === 'ADMIN_MAGASIN' ? 'Administrateur' : 'Employé' }}
        </v-list-item-subtitle>

        <template #append>
          <v-btn
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            color="error"
            :loading="suppressionEnCours === membre.id"
            @click="handleSupprimer(membre.id)"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>