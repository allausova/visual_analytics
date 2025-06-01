<script setup>
const { filteredData } = defineProps({ filteredData: Array })
</script>

<template>
  <h3>Rows found&nbsp;: {{ filteredData.length }}</h3>
</template>
