<script>
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import Map from './components/Map.vue';
import Filters from './components/Filters.vue';
import BarCharts from './components/BarCharts.vue';

export default {
  name: 'App',
  components: { Map, Filters, BarCharts },
  data() {
    return {
      rawData: [],
      worldGeoJson: null,
      pointCollection: { type: 'FeatureCollection', features: [] },
      filters: {
        host_since_year: { value: 'All', options: [] },
        Country: { value: 'All', options: [] },
        City: { value: 'All', options: [] },
        State: { value: 'All', options: [] },
      },
      chartData: {
        host_since_year: [],
        Country: [],
        property_type: [],
      },
      uniqueCount: 0,
      cf: null,
      dimensions: {},
    };
  },
  async mounted() {
    const [csvData, geoData] = await Promise.all([
      d3.csv('/data/airbnb-short-listings.csv'),
      d3.json('/data/world.geojson')
    ]);

    this.rawData = csvData.map(d => ({
      ...d,
      Latitude: +d.Latitude,
      Longitude: +d.Longitude,
      host_since_year: d.host_since_year,
    }));

    this.worldGeoJson = geoData;

    this.cf = crossfilter(this.rawData);

    // Set dimensions
    this.dimensions = {
      host_since_year: this.cf.dimension(d => d.host_since_year),
      Country: this.cf.dimension(d => d.Country),
      City: this.cf.dimension(d => d.City),
      State: this.cf.dimension(d => d.State),
      ID: this.cf.dimension(d => d.ID),
      property_type: this.cf.dimension(d => d.property_type),
    };

    this.initFilterOptions();
    this.applyFilters();
  },
  methods: {
    initFilterOptions() {
      ['host_since_year', 'Country', 'City', 'State'].forEach(key => {
        const group = this.dimensions[key].group().all().map(v => v.key).filter(Boolean);
        this.filters[key].options = ['All', ...group.sort()];
        this.filters[key].value = 'All';
      });
    },
    applyFilters() {
      Object.entries(this.filters).forEach(([key, filter]) => {
        if (filter.value === 'All') {
          this.dimensions[key].filterAll();
        } else {
          this.dimensions[key].filter(filter.value);
        }
      });
      this.refreshCounter();
      this.refreshCharts();
      this.refreshMap();
    },
    refreshCounter() {
      this.uniqueCount = this.dimensions.ID.group().all().length;
    },
    refreshCharts() {
      this.chartData.host_since_year = this.dimensions.host_since_year.group().reduceCount().all();
      this.chartData.Country = this.dimensions.Country.group().reduceCount().all();
      this.chartData.property_type = this.dimensions.property_type.group().reduceCount().all();
    },
    refreshMap() {
      const records = this.dimensions.ID.top(Infinity);
      this.pointCollection = {
        type: 'FeatureCollection',
        features: records.map(d => ({
          type: 'Feature',
          properties: { ...d },
          geometry: {
            type: 'Point',
            coordinates: [d.Longitude, d.Latitude]
          }
        }))
      };
    },
    handleFilterUpdate({ key, value }) {
      this.filters[key].value = value;
      this.applyFilters();
    },
  }
};
</script>

<template>
<div class="dashboard">
  <div class="left-panel">
    <Map :geoData="worldGeoJson" :points="pointCollection" />
  </div>

  <div class="right-panel">
    <Filters
      :filters="filters"
      @updateFilter="handleFilterUpdate"
    />
    
    <div class="counters">
      <p><strong>Unique Listings:</strong> {{ uniqueCount }}</p>
    </div>

    <div class="charts">
      <BarCharts :chartData="chartData" />
    </div>
  </div>
</div>
</template>

<style scoped>
/* .dashboard {
  display: flex;
  flex-direction: row; 
  height: 100vh; 
  width: 100wv;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.left-panel {
  flex: 2;
  max-width: 50vw;
  min-width: 0;
  padding: 0.5rem;
  overflow: hidden;
  background-color: #f0f0f0; 
}

.right-panel {
  flex: 1;
  padding: 1rem;
  max-width: 30vw;
  overflow-y: auto;
  min-width: 0;
  background-color: #f0f0f0; 
}
.counters {
  font-size: 14px;
  margin: 0.5rem 0;
} */
</style>