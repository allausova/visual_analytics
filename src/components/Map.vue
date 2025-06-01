<template>
  <svg height="500" width="100%">
    <g class="world" ref="world"></g>
    <g class="reports" ref="reports"></g>
  </svg>
</template>

<script>
import MapWithLayers from '@/assets/js/Layers';

import * as d3 from 'd3';

const map = MapWithLayers(); // component to handle the map

export default {
  name: 'Map',
  mounted() {
  const gWorld = d3.select(this.$refs.world);
  d3.json('/data/world.geojson')
    .then(world => {
      console.log('GeoJSON:', world);  // здесь посмотри, что приходит
      
      const filteredWorld = {
        ...world,
        features: world.features.filter(d => d.properties.CNTR_ID !== 'AQ')
      };
      
      gWorld.datum(filteredWorld).call(map);
    })
    .catch(err => console.error(err));
  },
};
</script>