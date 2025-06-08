
<template>
  <div class="dashboard">
    <div class="left-panel">
        <HelloWorld msg="Mapping the Dynamics of Airbnb Hosts Across Europe: Growth, Distribution, and Market Insights" />
    </div>
    <div class="right-panel">
      <TheWelcome />
    </div>
  </div>
</template>

<script setup>
import HelloWorld from './components/Left_part_old_map.vue'
import TheWelcome from './components/Old_right_part.vue'
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: row;
  /* height: 100vh;  */
}

.left-panel {
  flex: 2;
  max-width: 60vw;
  background-color: #f0f0f0;
}

.right-panel {
  flex: 1;
  padding: 1rem;
  max-width: 40vw;
  overflow-y: auto;
  background-color: #f0f0f0;
}
</style>
