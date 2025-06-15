<template>
  <div ref="chartContainer" style="height: 300px;"></div>
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

// 📈 Вычисляем темп прироста между годами
const calculateIncreaseRate = (data) => {
  const sorted = [...data].sort((a, b) => a.key - b.key)
  const result = []

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].value
    const curr = sorted[i].value

    if (prev === 0) continue

    const rate = ((curr - prev) / prev) * 100
    result.push({
      key: `${sorted[i-1].key} → ${sorted[i].key}`,
      value: parseFloat(rate.toFixed(2)) // округляем до двух знаков
    })
  }
  //result_sorted = [...result].sort((a, b) => a.key - b.key)
  console.log('📈 increase result:', result)
  return result
}

const drawChart = (data) => {
  const processedData = calculateIncreaseRate(data)
  const reversedValues = processedData.map(d => d.value).reverse()
  const reversedKeys = processedData.map(d => d.key).reverse()
  const reversedTexts = processedData.map(d => `${d.value}%`).reverse()

const trace = {
  type: 'bar',
  x: reversedValues,
  y: reversedKeys,
  orientation: 'h',
  marker: { color: '#3498db' },
  text: reversedTexts,
  textposition: 'outside',
  textfont: { color: '#000', size: 12 }
}

  const layout = {
    margin: { t: 30, l: 100, b: 30, r: 10 },
    yaxis: { type: 'category', automargin: true },
    xaxis: {
      title: 'Growth (%)',
      zeroline: false,
      ticksuffix: '%'
    }
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
</style>
