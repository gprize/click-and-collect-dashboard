<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import type { ProduitVendu } from '../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps<{
  produits: ProduitVendu[]
  couleurPrimaire: string
  couleurSecondaire: string
}>()

const quantiteMax = computed(() =>
  props.produits.length > 0 ? Math.max(...props.produits.map((p) => p.quantiteVendue)) : 0
)

const chartData = computed(() => ({
  labels: props.produits.map((p) => p.nom),
  datasets: [
    {
      label: 'Unités vendues',
      data: props.produits.map((p) => p.quantiteVendue),
      backgroundColor: props.produits.map((p) =>
        p.quantiteVendue === quantiteMax.value ? props.couleurSecondaire : props.couleurPrimaire
      ),
      borderRadius: 6
    }
  ]
}))

const chartOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { beginAtZero: true, ticks: { stepSize: 1 } }
  }
}
</script>

<template>
  <div style="height: 280px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>