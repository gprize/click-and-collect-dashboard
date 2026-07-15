<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginStaff } from '../services/authService'
import { useSessionStore } from '@/stores/session'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const session = useSessionStore()

const email = ref('')
const motDePasse = ref('')
const chargement = ref(false)
const erreur = ref<string | null>(null)

async function valider() {
  erreur.value = null
  chargement.value = true

  try {
    const auth = await loginStaff(email.value, motDePasse.value)
    session.definirSession(auth)
    router.push({ name: 'dashboard' })
  } catch (e) {
    erreur.value = e instanceof ApiError ? e.message : 'Une erreur est survenue'
  } finally {
    chargement.value = false
  }
}
</script>

<template>
  <v-container class="py-8 text-center" style="max-width: 420px">
    <div class="custom-underline"><h1 class="text-h5">Click & Collect 🛍️</h1></div>
    <h2 class="text-h5 mb-8">Espace magasin</h2>

    <v-form @submit.prevent="valider">
      <v-text-field v-model="email" label="Email" type="email" class="mb-2" />
      <v-text-field v-model="motDePasse" label="Mot de passe" type="password" class="mb-4" />

      <v-alert v-if="erreur" type="error" :text="erreur" class="mb-4" />

      <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="chargement">
        Se connecter
      </v-btn>
    </v-form>
  </v-container>
</template>