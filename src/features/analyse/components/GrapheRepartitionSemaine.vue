<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { JourSemaineVente } from '../types'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ donnees: JourSemaineVente[]; couleurPrimaire: string }>()

function hexVersHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min

  if (d !== 0) {
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
      case g: h = ((b - r) / d + 2) * 60; break
      case b: h = ((r - g) / d + 4) * 60; break
    }
    return [h, s, l]
  }
  return [0, 0, l]
}

// Fait tourner la teinte autour du cercle chromatique, en gardant saturation/luminosité constantes
function genererPalette(couleurBase: string, nombre: number): string[] {
  const [, s, l] = hexVersHsl(couleurBase)
  const saturation = Math.max(s, 0.45); // garantit des couleurs vives même si la marque est pâle
  const luminosite = Math.min(Math.max(l, 0.4), 0.6); // évite les couleurs trop claires/foncées en camembert

  return Array.from({ length: nombre }, (_, i) => {
    const teinte = (i * (360 / nombre)) % 360
    return `hsl(${teinte.toFixed(0)}, ${(saturation * 100).toFixed(0)}%, ${(luminosite * 100).toFixed(0)}%)`
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