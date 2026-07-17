<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMagasinStore } from '@/stores/magasin'
import { useSessionStore } from '@/stores/session'

const route = useRoute()
const router = useRouter()
const magasinStore = useMagasinStore()
const session = useSessionStore()

const afficherNav = computed(() => route.name !== 'login')

function deconnecter() {
  session.deconnecter()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app>
    <v-theme-provider v-if="afficherNav && magasinStore.magasin" theme="sidebar">
      <v-navigation-drawer permanent color="surface" width="240">
        <div class="pa-4 text-center">
          <div class="d-flex align-center justify-center" style="gap: 10px;">
            <v-img
              v-if="magasinStore.magasin.logoUrl"
              :src="magasinStore.magasin.logoUrl"
              height="28"
              width="28"
              contain
            />
            <span v-else class="font-weight-bold text-primary" style="font-family: var(--font-display); font-size: 0.95rem;">
              {{ magasinStore.magasin.nom }}
            </span>
            <span class="text-medium-emphasis" style="font-size: 1rem;">×</span>
            <v-img src="/pwa-192x192.png" height="28" width="28" contain />
          </div>
          <v-chip size="x-small" color="primary" variant="flat" class="mt-3">Espace magasin</v-chip>
        </div>

        <v-divider class="my-2" style="opacity: 0.15" />

        <v-list nav density="comfortable">
          <v-list-item :to="{ name: 'dashboard' }" prepend-icon="mdi-clipboard-list-outline" title="Commandes" rounded="lg" />
          <v-list-item :to="{ name: 'analyses' }" prepend-icon="mdi-chart-line" title="Analyses" rounded="lg" />
          <v-list-item :to="{ name: 'stock' }" prepend-icon="mdi-package-variant" title="Stock" rounded="lg" />
        </v-list>

        <template #append>
          <v-list nav density="comfortable" class="pb-2">
            <v-list-item prepend-icon="mdi-logout" title="Déconnexion" rounded="lg" @click="deconnecter" />
          </v-list>
        </template>
      </v-navigation-drawer>
    </v-theme-provider>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>