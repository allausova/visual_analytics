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
  },
    colorScale: {
      type: Function,
      required: false 
    },
  sortDesc: {
    type: Boolean,
    default: false
  }
})

const chartContainer = ref(null)

const drawChart = (dt) => {
  const data = [...dt]//.sort((a, b) => b.key - a.key)
  // Сортировка: по значению (value) если sortDesc=true, иначе по ключу (key)
  if (props.sortDesc) {
    data.sort((a, b) => a.value - b.value)
  } else {
    data.sort((a, b) => b.key - a.key)
  }
  const trace = {
    type: 'bar',
    x: data.map(d => d.value),
    y: data.map(d => d.key),
    orientation: 'h',
    marker: {
      color: data.map(d => props.colorScale ? props.colorScale(d.key) : '#FF5A5F')
    },
    text: data.map(d => d.value),
    textposition: 'outside',
    textfont: { color: '#000', size: 12 }
  }
  const markerTrace = {
    type: 'scatter',
    mode: 'markers',
    x: data.map(d => d.value),
    y: data.map(d => d.key),
    marker: {
      color: '#e74c3c',
      size: 8,
      symbol: 'circle'
    },
    showlegend: false,
    hoverinfo: 'skip'
  }
  const maxXValue = Math.max(...dt.map(d => d.value));
  const layout = {
    // height: 250,
    margin: { t: 10, l: 120, b: 30, r: 20, pad: 5 },
    yaxis: { type: 'category', automargin: true},
    xaxis: { zeroline: false , range: [0, maxXValue * 1.15] }
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
/* div {
  height: 250px;
} */
</style>
