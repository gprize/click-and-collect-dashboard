<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'
import type { VenteParJour } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const props = defineProps<{ ventes: VenteParJour[]; couleurPrimaire: string; jours: number }>()

function completerJoursManquants(): VenteParJour[] {
  const parDate = new Map(props.ventes.map((v) => [v.date, v.total]))
  const resultat: VenteParJour[] = []

  for (let i = props.jours - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const cle = date.toISOString().slice(0, 10)
    resultat.push({ date: cle, total: parDate.get(cle) ?? 0 })
  }

  return resultat
}

const donneesCompletes = computed(() => completerJoursManquants())

const chartData = computed(() => ({
  labels: donneesCompletes.value.map((v) =>
    new Date(v.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  ),
  datasets: [
    {
      label: 'Chiffre d\'affaires',
      data: donneesCompletes.value.map((v) => v.total),
      borderColor: props.couleurPrimaire,
      backgroundColor: `${props.couleurPrimaire}22`,
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: props.couleurPrimaire
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { raw: unknown }) => `${Number(context.raw).toLocaleString('fr-FR')} FCFA`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number | string) => `${Number(value).toLocaleString('fr-FR')}`
      }
    }
  }
}
</script>

<template>
  <div style="height: 280px">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>