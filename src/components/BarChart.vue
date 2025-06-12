<template>
  <div ref="chartContainer" style="height: 250px;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Plotly from 'plotly.js-dist-min'

const props = defineProps({
  cfAggregation: {
    type: Array,
    default: () => []
  }
})

const chartContainer = ref(null)

const drawChart = (data) => {
  const trace = {
    type: 'bar',
    x: data.map(d => d.value),
    y: data.map(d => d.key),
    orientation: 'h',
    marker: { color: '#3498db' }
  }

  const layout = {
    height: 250,
    margin: { t: 10, l: 70, b: 30, r: 10, pad: 5 },
    yaxis: { type: 'category' },
    xaxis: { zeroline: false }
  }

  const config = {
    displayModeBar: false
  }

  Plotly.newPlot(chartContainer.value, [trace], layout, config)
}

onMounted(() => {
  drawChart(props.cfAggregation)
})

watch(() => props.cfAggregation, (newVal) => {
  drawChart(newVal)
})
</script>

<style scoped>
div {
  height: 250px;
}
</style>
