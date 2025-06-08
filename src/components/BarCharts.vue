<script>
import * as d3 from 'd3';

export default {
  name: 'BarCharts',
  props: ['chartData'], // expects chartData to have host_since_year, Country, property_type
  mounted() {
    this.renderCharts();
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderCharts();
      },
    },
  },
  methods: {
    renderBar(ref, dataset, labelField) {
      if (!Array.isArray(dataset)) return;

      const svg = d3.select(this.$refs[ref]);
      svg.selectAll('*').remove();

      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const x = d3.scaleBand()
        .domain(dataset.map(d => d.key))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.value)])
        .range([height, 0]);

      svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', '#69b3a2');

      svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d => d.value)
        .attr('x', d => x(d.key) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px');
    },
    renderCharts() {
      this.renderBar('yearChart', this.chartData.host_since_year, 'host_since_year');
      this.renderBar('countryChart', this.chartData.Country, 'Country');
      this.renderBar('propertyChart', this.chartData.property_type, 'property_type');
    }
  }
};
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3>Listings by Year</h3>
      <svg ref="yearChart" width="300" height="150"></svg>
    </div>
    <div>
      <h3>Listings by Country</h3>
      <svg ref="countryChart" width="300" height="150"></svg>
    </div>
    <div>
      <h3>Listings by Property Type</h3>
      <svg ref="propertyChart" width="300" height="150"></svg>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0.25rem 0;
  font-weight: bold;
  font-size: 0.9rem;
}

svg {
  display: block;
  margin: 0;
  padding: 0;
}
</style>

