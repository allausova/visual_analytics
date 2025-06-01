<script setup>
import { ref, computed, onMounted } from 'vue'
import * as d3 from 'd3'

// данные
const data = ref([])

// фильтры
const selectedCountry = ref('')
const selectedState = ref('')
const selectedCity = ref('')
const selectedYear = ref('')

// загрузка данных
onMounted(async () => {
  const csv = await d3.csv('/data/airbnb-short-listings.csv')
  csv.forEach(d => {
    d.host_since_year = +d.host_since_year
  })
  data.value = csv
})

// вычисления для списков (аналогично предыдущему)
const countries = computed(() => [...new Set(data.value.map(d => d.Country))].sort())
const states = computed(() =>
  [...new Set(data.value.filter(d => !selectedCountry.value || d.Country === selectedCountry.value).map(d => d.State))].sort()
)
const cities = computed(() =>
  [...new Set(data.value.filter(d =>
    (!selectedCountry.value || d.Country === selectedCountry.value) &&
    (!selectedState.value || d.State === selectedState.value)
  ).map(d => d.City))].sort()
)
const years = computed(() =>
  [...new Set(data.value.filter(d =>
    (!selectedCountry.value || d.Country === selectedCountry.value) &&
    (!selectedState.value || d.State === selectedState.value) &&
    (!selectedCity.value || d.City === selectedCity.value)
  ).map(d => d.host_since_year))].sort((a, b) => a - b)
)

// отфильтрованные данные
const filteredData = computed(() =>
  data.value.filter(d =>
    (!selectedCountry.value || d.Country === selectedCountry.value) &&
    (!selectedState.value || d.State === selectedState.value) &&
    (!selectedCity.value || d.City === selectedCity.value) &&
    (!selectedYear.value || d.host_since_year === +selectedYear.value)
  )
)

// отдаём наружу
defineExpose({ filteredData })
</script>

<template>
  <div>
    <h2>Filters</h2>
    <div>
      <label>Country:</label>
      <select v-model="selectedCountry" style="width: 200px">
        <option value="">All</option>
        <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
    <div>
      <label>State:</label>
      <select v-model="selectedState" style="width: 200px">
        <option value="">All</option>
        <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <div>
      <label>City:</label>
      <select v-model="selectedCity" style="width: 200px">
        <option value="">All</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
    <div>
      <label>Year:</label>
      <select v-model="selectedYear" style="width: 200px">
        <option value="">All</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>
  </div>
</template>
