<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-group label="Year since" label-for="year-select" class="mb-3">
          <b-form-select
            id="year-select"
            v-model="year.value"
            :options="year.options"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="Country" label-for="country-select" class="mb-3">
          <b-form-select
            id="country-select"
            v-model="country.value"
            :options="country.options"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="Property Type" label-for="property-select" class="mb-3">
          <b-form-select
            id="property-select"
            v-model="propertyType.value"
            :options="propertyType.options"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <h1 class="headings_color">Mapping the Dynamics of Airbnb Hosts Across Europe: Growth, Distribution, and Market Insights</h1>

        <div style="height:500px">
          <Map
            v-if="colorScale_property"
            :featureCollection="pointCollection"
            :colorScale="colorScale_property"
          />
        </div>
      </b-col>

      <b-col>
        <h5 class="headings_color">Number of hosts over the years</h5>
        <Chart :cfAggregation="dataYear" class="mb-3" />
        <h5>Number of hosts over countries/citites</h5>
        <h7 class="subheadings_color">To see the number of properies over top cities choose the specific country</h7>
        <Chart
            v-if="country.value === 'All'"
            :cfAggregation="dataCountry" :sortDesc="true"
            class="mb-3"
          />
          <Chart
            v-else
            :cfAggregation="dataCity" :sortDesc="true"
            class="mb-3"
          />
        <h5 class="headings_color">Distribution of property types (top 10)</h5>
        <Chart :cfAggregation="dataPropertyType" :sortDesc="true" class="mb-3" :colorScale="colorScale_property" />
      </b-col>
    </b-row>

    <b-row>
      <IR :cfAggregation="dataYear" class="mb-3" />
    </b-row>
  </b-container>
</template>

<script>
import Chart from './components/BarChart.vue'
import crossfilter from 'crossfilter2'
import * as d3 from 'd3'
import Map from './components/Map_with_layers.vue'
import IR from './components/Increase_rate.vue'

export default {
  name: 'Airbnb',
  components: {
    Map,
    Chart,
    IR
  },

  data() {
    return {
      year: {
        value: 'All',
        options: ['All']
      },
      country: {
        value: 'All',
        options: ['All']
      },
      propertyType: {
        value: 'All',
        options: ['All']
      },
      numRecords: 0,
      dataYear: [],
      dataCountry: [],
      dataPropertyType: [],
      dataCity: [],
      pointCollection: {
        type: 'FeatureCollection',
        features: []
      },
      cf: null,
      dYear: null,
      dCountry: null,
      dCity: null,
      dPropertyType: null,
      colorScale_property: null
    }
  },

  mounted() {
    fetch('/data/country_clusters.json')
      .then(res => res.json())
      .then(data => {
        // Приведение ключей из json к camelCase и типам
        const reports = data.map(d => ({
          Property_type: d.property_type,
          Country: d.country,
          year: +d.host_since_year,
          count: +d.count,
          Latitude: +d.avg_lat,
          Longitude: +d.avg_lon,
          City: d.city
        }))

        const propertyTypes = [...new Set(reports.map(r => r.Property_type))]
        this.colorScale_property = d3.scaleOrdinal()
          .domain(propertyTypes)
          .range(['#FF5A5F', '#5AC8FF', '#FFA07A', '#FDB45C', '#4BC0C0', '#C45850', '#7E57C2', '#FF7043', '#26A69A', '#66BB6A'])

        this.cf = crossfilter(reports)
        this.dYear = this.cf.dimension(d => d.year)
        this.dCountry = this.cf.dimension(d => d.Country)
        this.dCity = this.cf.dimension(d => d.City)
        this.dPropertyType = this.cf.dimension(d => d.Property_type)

        this.year.options = ['All'].concat(
          this.dYear.group().reduceSum(d => d.count).all().map(v => v.key)
        )
        this.year.value = 'All'

        this.country.options = ['All'].concat(
          this.dCountry.group().reduceSum(d => d.count).all().map(v => v.key)
        )
        this.country.value = 'All'

        this.propertyType.options = ['All'].concat(
          this.dPropertyType.group().reduceSum(d => d.count).all().map(v => v.key)
        )
        this.propertyType.value = 'All'

        this.refreshCounters()
        this.refreshCharts()
        this.refreshMap()
      })
  },

  methods: {
    refreshCounters() {
      this.numRecords = this.cf.groupAll().reduceSum(d => d.count).value()
      console.log('🔢 Total records:', this.numRecords)
    },

    refreshCharts() {
      this.dataYear = this.dYear.group().reduceSum(d => d.count).all()
      this.dataCountry = this.dCountry.group().reduceSum(d => d.count).all()
      this.dataPropertyType = this.dPropertyType.group().reduceSum(d => d.count).all()
      const cityGroups = this.dCity.group().reduceSum(d => d.count).all()
        this.dataCity = cityGroups
          .sort((a, b) => d3.descending(a.value, b.value))
          .slice(0, 10)
      const PropertyGroups = this.dPropertyType.group().reduceSum(d => d.count).all()
        this.dataPropertyType = PropertyGroups
          .sort((a, b) => d3.descending(a.value, b.value))
          .slice(0, 10)
    },

    refreshMap() {
      const filteredReports = this.cf.allFiltered()
      this.pointCollection = this.getGeoJsonFromReports(filteredReports)
    },

    getGeoJsonFromReports(reports) {
      return {
        type: 'FeatureCollection',
        features: reports
          .filter(d => d.Latitude && d.Longitude)
          .map(d => ({
            type: 'Feature',
            properties: {
              Property_type: d.Property_type,
              City: d.City,
              Country: d.Country,
              year: d.year,
              count: d.count
            },
            geometry: {
              type: 'Point',
              coordinates: [d.Longitude, d.Latitude]
            }
          }))
      }
    }
  },

  watch: {
    'year.value'(newVal) {
      if (newVal === 'All') {
        this.dYear.filterAll()
      } else {
        this.dYear.filter(d => d <= newVal)
      }
      this.refreshCounters()
      this.refreshCharts()
      this.refreshMap()
    },

    'country.value'(newVal) {
      if (newVal === 'All') {
        this.dCountry.filterAll()
      } else {
        this.dCountry.filter(newVal)
      }
      this.refreshCounters()
      this.refreshCharts()
      this.refreshMap()
    },

    'propertyType.value'(newVal) {
      if (newVal === 'All') {
        this.dPropertyType.filterAll()
      } else {
        this.dPropertyType.filter(newVal)
      }
      this.refreshCounters()
      this.refreshCharts()
      this.refreshMap()
    }
  }
}
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}
</style>
