<script setup>
import Map from './Map_old.vue'; // <-- импорт должен быть здесь, внутри <script setup>

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <!--
    <h3>
      The country of Oceanus has sought FishEye International’s help in identifying companies possibly engaged in illegal, unreported, and unregulated (IUU) fishing. 
      Using visual analytics, can you help FishEye identify companies that may be engaged in illegal fishing?

      Please visit <a href="https://vast-challenge.github.io/2023/MC2.html" target="_blank" rel="noopener">VAST Challenge 2023: Mini-Challenge 2</a> 
      for more information and to download the data.
    </h3>
    -->
    <!-- <h3>Map</h3> -->
    <div style="height:500px; background-color: beige">
      <Map /> 
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 500px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
