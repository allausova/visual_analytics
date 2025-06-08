<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import * as d3 from 'd3'

import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import Crossfilter from './Crossfilter.vue'
import Count from './Count.vue'

// доступ к expose
const filterRef = ref(null)
const filteredData = ref([])

watchEffect(() => {
  if (filterRef.value?.filteredData) {
    filteredData.value = filterRef.value.filteredData
  }
})
</script>

<template>
  <div>
    <!-- передаём ref -->
    <Crossfilter ref="filterRef" />

    <!-- счётчик -->
    <Count :filteredData="filteredData" />
  </div>

  <!-- существующие блоки WelcomeItem -->
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Growth Rates:</template>
      Compute % growth rates of hosts per country/state/city over different periods.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Compute host Concentration:</template>
      Probably use metrics like Herfindahl–Hirschman Index (HHI) to see how concentrated hosting is in certain areas.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Choropleth map of Europe showing host density.</template>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Bar charts for top cities by host count.</template>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Filters for property types or room types and years.</template>
  </WelcomeItem>
</template>
