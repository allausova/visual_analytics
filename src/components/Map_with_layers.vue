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
    },
    colorScale: {
      type: Function,
      required: false // не обязательно, по умолчанию будет серый
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
        pointerEvents: 'none'
      },
      tooltipData: {
        City: '',
        Property_type: '',
        year: ''
      },
      currentZoom: 1
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
        console.log('🗺️ Projection created:', this.projection);

        this.updatePoints();
      })
      .catch(err => console.error('Map load error:', err));

    const zoomGroup = svg.select('g.zoom-group');
    svg.call(
      d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          this.currentZoom = event.transform.k;
          zoomGroup.attr('transform', event.transform);

          gReports.selectAll('circle.country-cluster')
            .style('display', this.currentZoom < 2 ? 'block' : 'none');

          gReports.selectAll('circle.prop-point')
            .style('display', this.currentZoom >= 2 ? 'block' : 'none');

          gReports.selectAll('text.cluster-count')
            .style('display', this.currentZoom < 2 ? 'block' : 'none');
        })
    );
  },

  watch: {
    featureCollection: {
      handler(newVal) {
        console.log('🗺️ featureCollection updated:', newVal ? newVal.features.length : 0, 'features');
        this.updatePoints();
      },
      deep: true
    }
  },

  methods: {
    updatePoints() {
      if (!this.projection || !this.featureCollection) return;

      const gReports = d3.select(this.$refs.reports);
      const vm = this;
      const countryClusters = d3.rollups(
        this.featureCollection.features,
        v => ({ count: v.length, cities: v }),
        d => d.properties.Country
      );

      const clusters = countryClusters.map(([country, { count, cities }]) => {
        const avgLon = d3.mean(cities, d => d.geometry.coordinates[0]);
        const avgLat = d3.mean(cities, d => d.geometry.coordinates[1]);
        const [x, y] = this.projection([avgLon, avgLat]);

        // Определим наиболее частый Property_type
        const typeCounts = d3.rollup(
          cities,
          v => v.length,
          d => d.properties.Property_type
        );
        const topPropertyType = Array.from(typeCounts.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

        return {
          country,
          count,
          coords: [x, y],
          topPropertyType
        };
      });


      const points = this.featureCollection.features
        .filter(d => d.geometry && d.geometry.coordinates)
        .map(d => {
          const [lon, lat] = d.geometry.coordinates;
          const coords = this.projection([lon, lat]);
          return {
            ...d,
            coords
          };
        });

      // Кластеры стран
      gReports.selectAll('circle.country-cluster')
        .data(clusters)
        .join('circle')
        .attr('class', 'country-cluster')
        .attr('cx', d => d.coords[0])
        .attr('cy', d => d.coords[1])
        .attr('r', d => Math.sqrt(d.count) * 2.5)
        .attr('fill', d => this.colorScale ? this.colorScale(d.topPropertyType) : 'steelblue')
        .attr('opacity', 0.7);

      // Подписи количества
      gReports.selectAll('text.cluster-count')
        .data(clusters)
        .join('text')
        .attr('class', 'cluster-count')
        .attr('x', d => d.coords[0])
        .attr('y', d => d.coords[1] + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'white')
        .text(d => d.count);

      
      gReports.selectAll('circle.prop-point')
        .data(points)
        .join('circle')
        .attr('class', 'prop-point')
        .attr('cx', d => d.coords[0])
        .attr('cy', d => d.coords[1])
        .attr('r', 2.5)
        .attr('fill', d => this.colorScale ? this.colorScale(d.properties.Property_type) : 'steelblue')
        .attr('opacity', 0.7)
        .style('display', this.currentZoom >= 2 ? 'block' : 'none')
        .on('mouseenter', function (event, d) {
          console.log('mouseenter', d.properties);
          vm.tooltipVisible = true;
          vm.tooltipData = d.properties;
        })
        .on('mousemove', function (event) {
          const containerRect = vm.$refs.container.getBoundingClientRect();
          const left = event.pageX - containerRect.left + 15;
          const top = event.pageY - containerRect.top + 15;
          vm.tooltipStyle = {
            left: `${left}px`,
            top: `${top}px`,
            pointerEvents: 'none'
          };
        })
        .on('mouseleave', function () {
          vm.tooltipVisible = false;
        });
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
