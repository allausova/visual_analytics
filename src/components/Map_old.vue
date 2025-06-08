<template>
  <svg height="500" width="100%">
    <g class="world" ref="world"></g>
    <g class="reports" ref="reports"></g>
  </svg>
</template>

<script>
import MapWithLayers from '@/assets/js/Layers'
import * as d3 from 'd3'

export default {
  name: 'Map',
  mounted() {
    const gWorld = d3.select(this.$refs.world)
    const gReports = d3.select(this.$refs.reports)

    const map = MapWithLayers()
      .scale(700)
      .center([-10, 50]) // Центрируем на Европу

    d3.json('/data/world.geojson')
      .then(world => {
        const filteredWorld = {
          ...world,
          features: world.features.filter(d => d.properties.CNTR_ID !== 'AQ')
        }

        // отрисовка карты
        gWorld.datum(filteredWorld).call(map)

        // теперь проекция, с которой рисовалась карта:
        const projection = d3.geoMercator()
          .scale(700)
          .center([-10, 50])
          .translate([this.$el.clientWidth / 2, 250]) // SVG высота 500

        // загружаем CSV
        d3.csv('/data/airbnb-listing-ch.csv').then(data => {
          const points = data
            .filter(d => d.Latitude && d.Longitude)
            .map(d => ({
              ...d,
              coords: projection([+d.Longitude, +d.Latitude])
            }))

          // проверим, что координаты есть
          console.log('Sample coords:', points[0])

          gReports.selectAll('circle')
            .data(points)
            .join('circle')
            .attr('cx', d => d.coords[0])
            .attr('cy', d => d.coords[1])
            .attr('r', 2.5)
            .attr('fill', 'crimson')
            .attr('opacity', 0.7)
        })
      })
      .catch(err => console.error('Map load error:', err))
  }
}
</script>
