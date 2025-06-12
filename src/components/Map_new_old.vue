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
  props: {
    featureCollection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      projection: null
    }
  },
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

        gWorld.datum(filteredWorld).call(map)

        // сохраняем проекцию
        this.projection = d3.geoMercator()
          .scale(700)
          .center([-10, 50])
          .translate([this.$el.clientWidth / 2, 250])

        console.log('🗺️ Projection created:', this.projection)

        // начальная отрисовка
        this.updatePoints()
      })
      .catch(err => console.error('Map load error:', err))
  },
  watch: {
    featureCollection: {
      handler(newVal) {
        console.log('🗺️ featureCollection updated:', newVal ? newVal.features.length : 0, 'features')
        this.updatePoints()
      },
      deep: true
    }
  },
  methods: {
    updatePoints() {
      if (!this.projection) {
        console.warn('🗺️ updatePoints: projection not ready yet')
        return
      }
      if (!this.featureCollection) {
        console.warn('🗺️ updatePoints: featureCollection is empty or undefined')
        return
      }

      const gReports = d3.select(this.$refs.reports)

      const points = this.featureCollection.features
        .filter(d => d.geometry && d.geometry.coordinates)
        .map(d => {
          const [lon, lat] = d.geometry.coordinates
          const coords = this.projection([lon, lat])
          return {
            ...d,
            coords
          }
        })

      console.log('🗺️ Points to draw:', points.length, 'Sample point coords:', points[0]?.coords)

      gReports.selectAll('circle')
        .data(points)
        .join('circle')
        .attr('cx', d => d.coords[0])
        .attr('cy', d => d.coords[1])
        .attr('r', 2.5)
        .attr('fill', 'crimson')
        .attr('opacity', 0.7)
    console.log(`🗺️ All ${points.length} points have been rendered on the map.`)
    }
  }
}
</script>

<style>
    /* svg {
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    } */
</style>
