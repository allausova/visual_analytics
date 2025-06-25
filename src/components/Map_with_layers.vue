<template>
  <div ref="container" style="position: relative;">
    <svg ref="svg" height="500" width="100%">
      <g class="zoom-group">
        <g class="world" ref="world"></g>
        <g class="reports" ref="reports"></g>
      </g>
    </svg>

    </div>
  <div style="position: absolute; bottom: 50; left: 30; background: #eee; font-size: 12px; z-index: 10001;">
      <div><strong>City:</strong> {{ tooltipData.City }}</div>
      <div><strong>Property:</strong> {{ tooltipData.Property_type }}</div>
      <div><strong>Year:</strong> {{ tooltipData.year }}</div>
  </div>
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
      projection: null,
      map: null,
      tooltipVisible: false,
      tooltipStyle: {
        left: '0px',
        top: '0px',
        pointerEvents: 'none',
        position: 'absolute',
        // добавим чтобы при любом раскладе позиционировался правильно
        zIndex: 10000,
        background: 'white',
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '0.9rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
      },
      tooltipData: {
        City: '',
        Property_type: '',
        year: ''
      }
    }
  },

  mounted() {
    const svg = d3.select(this.$refs.svg);
    const gWorld = d3.select(this.$refs.world);
    const gReports = d3.select(this.$refs.reports);

    this.projection = d3.geoMercator()
      .scale(1000)
      .center([-5, 52])
      .translate([this.$refs.container.clientWidth / 2, 250]);

    this.map = MapWithLayers().setProjection(this.projection);

    d3.json('/data/world.geojson')
      .then(world => {
        const filteredWorld = {
          ...world,
          features: world.features.filter(d => d.properties.CNTR_ID !== 'AQ')
        };
        gWorld.datum(filteredWorld).call(this.map);
        console.log('🗺️ Projection created:', this.projection)

        this.updatePoints();
      })
      .catch(err => console.error('Map load error:', err));

    // Зум
    const zoomGroup = svg.select('g.zoom-group');
    svg.call(
      d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          zoomGroup.attr('transform', event.transform);
        })
    );
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
      const vm = this;

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
    .on('mouseenter', function (event, d) {
      console.log('mouseenter, d.properties:', d.properties);
      vm.tooltipData = { ...d.properties };
      vm.tooltipVisible = true;
    })
    .on('mousemove', function (event) {
      const containerRect = vm.$refs.container.getBoundingClientRect();
      const left = event.pageX - containerRect.left + 15;
      const top = event.pageY - containerRect.top + 15;
      vm.tooltipStyle = {
        left: `${left}px`,
        top: `${top}px`,
        pointerEvents: 'auto'
      };
    })
    .on('mouseleave', function () {
      vm.tooltipVisible = false;
      vm.tooltipData = { City: '', Property_type: '', year: '' };
    });

      console.log(`🗺️ All ${points.length} points have been rendered on the map.`)
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: absolute;
  background: white;
  color: black;           
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 10000;
  white-space: nowrap;
}

svg {
  position: relative;
  z-index: 0;
}
</style>
