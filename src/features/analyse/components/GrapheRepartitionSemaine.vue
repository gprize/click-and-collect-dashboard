<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { JourSemaineVente } from '../types'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ donnees: JourSemaineVente[]; couleurPrimaire: string }>()

// Décline la couleur de marque en 7 teintes, du plus foncé au plus clair
function genererPalette(couleurBase: string, nombre: number): string[] {
  const r = parseInt(couleurBase.slice(1, 3), 16)
  const g = parseInt(couleurBase.slice(3, 5), 16)
  const b = parseInt(couleurBase.slice(5, 7), 16)

  return Array.from({ length: nombre }, (_, i) => {
    const facteur = 0.4 + (i / (nombre - 1)) * 0.6
    const nr = Math.round(r * facteur + 255 * (1 - facteur) * 0.3)
    const ng = Math.round(g * facteur + 255 * (1 - facteur) * 0.3)
    const nb = Math.round(b * facteur + 255 * (1 - facteur) * 0.3)
    return `rgb(${nr}, ${ng}, ${nb})`
  })
}

const chartData = computed(() => ({
  labels: props.donnees.map((d) => d.jour),
  datasets: [
    {
      data: props.donnees.map((d) => d.total),
      backgroundColor: genererPalette(props.couleurPrimaire, props.donnees.length),
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }
  ]
}))

const total = computed(() => props.donnees.reduce((sum, d) => sum + d.total, 0));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { boxWidth: 12, padding: 12 }
    },
    tooltip: {
      callbacks: {
        label: (context: { label: string; raw: unknown }) => {
          const valeur = Number(context.raw)
          const pourcentage = total.value > 0 ? ((valeur / total.value) * 100).toFixed(0) : 0
          return `${context.label} : ${valeur.toLocaleString('fr-FR')} FCFA (${pourcentage}%)`
        }
      }
    }
  }
}))
</script>

<template>
  <div style="height: 280px">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>