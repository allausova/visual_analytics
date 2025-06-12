
<template>
  <svg ref="svgMap" class="w-full h-full"></svg>
</template>

<script>
import * as d3 from 'd3';
import MapWithLayers from '@/assets/js/Layers';

export default {
  name: 'Map',
  props: ['geoData', 'points'],
  mounted() {
    this.drawMap();
  },
  watch: {
    points() {
      this.drawPoints();
    },
    geoData() {
      this.drawMap();
    },
  },
  methods: {
    drawMap() {
    const svg = d3.select(this.$refs.svgMap);
    svg.selectAll('*').remove();

    if (!this.geoData || !this.geoData.features) return;

    const g = svg.append('g');
    const map = MapWithLayers()
        .scale(700)
        .center([-10, 50]) // Центрируем на Европу

    g.datum(this.geoData).call(map);
    this.drawPoints();
    },
    drawPoints() {
      if (!this.points || !this.geoData) return;

      const svg = d3.select(this.$refs.svgMap);
      const g = svg.select('g');
      const projection = d3.geoMercator()
        .scale(100)
        .center([0, 20])
        .translate([svg.node().getBoundingClientRect().width / 2, svg.node().getBoundingClientRect().height / 2]);

      g.selectAll('circle.airbnb')
        .data(this.points)
        .join('circle')
        .attr('class', 'airbnb')
        .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
        .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
        .attr('r', 3)
        .attr('fill', 'red')
        .attr('opacity', 0.7);
    }
  },
};
</script>


<style scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>