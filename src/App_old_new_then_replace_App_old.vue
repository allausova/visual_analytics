<!-- 
<template>
  <div class="dashboard">
    <div class="left-panel">
      <HelloWorld msg="Mapping the Dynamics of Airbnb Hosts Across Europe: Growth, Distribution, and Market Insights" />
    </div>
    <div class="right-panel">
        <Chart :cfAggregation="dataYear"></Chart>
        <Chart :cfAggregation="dataCountry"></Chart>
        <Chart :cfAggregation="dataPropertyType"></Chart>
    </div>

  </div>
</template>-->

<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-group label="Year" label-for="year-select" class="mb-3">
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
      <b-col >
        <HelloWorld msg="Mapping the Dynamics of Airbnb Hosts Across Europe: Growth, Distribution, and Market Insights" />
      </b-col>

      <b-col>
        <Chart :cfAggregation="dataYear" class="mb-3" />
        <Chart :cfAggregation="dataCountry" class="mb-3" />
        <Chart :cfAggregation="dataPropertyType" class="mb-3" />
      </b-col>
    </b-row>
  </b-container>
</template>




<script>
import HelloWorld from './components/Left_part_old_map.vue'
import TheWelcome from './components/Old_right_part.vue'
import Chart from './components/BarChart.vue'
import crossfilter from 'crossfilter2'
import * as d3Dsv from 'd3-dsv';

// crossfilter data management

// let cf; // crossfilter instance
// let dYear; // dimension for Year
// let dCountry; // dimension for Country
// let dPropertyType; // dimension for PropertyType

export default {
  name: 'Airbnb',
  components: {
    HelloWorld,
    TheWelcome,
    Chart  
  },
  data() {
    return {
      year: {
        value: 'All',
        options: ['All', 2013, 2014, 2015]
      },
      country: {
        value: 'All',
        options: ['All', 'Italy', 'Austria']
      },
      propertyType: {
        value: 'All',
        options: ['All']
      },
      numRecords: 0,
      dataYear: [],
      dataCountry: [],
      dataPropertyType: [],
      pointCollection: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Default point'
            },
            geometry: {
              type: 'Point',
              coordinates: [1, 1]
            }
          }
        ]
      },
      cf: null,
      dYear: null,
      dCountry: null,
      dPropertyType: null
    }
  },
  mounted() {
    fetch('data/airbnb-short-listings.csv')
      .then(res => res.text())
      .then(csvText => {
        const data = d3Dsv.csvParse(csvText);
        const reports = data.map((d) => {
          const r = {
            Property_type: d.property_type,
            City: d.City,
            State: d.State,
            Country: d.Country,
            year: +d.host_since_year,
            Latitude: +d.Latitude,
            Longitude: +d.Longitude
          }

          if (d.Latitude) {
            r.LaunchCoords = [+d.Latitude, +d.Longitude]
          }

          return r
        })

        // initialize Crossfilter
        //cf = crossfilter(reports)
        this.cf = crossfilter(reports)
        this.dYear = this.cf.dimension(d => d.year)
        this.dCountry = this.cf.dimension(d => d.Country)
        this.dPropertyType = this.cf.dimension(d => d.Property_type)

        this.year.options = ['All'].concat(this.dYear.group().reduceCount().all().map(v => v.key))
        this.year.value = this.year.options[0]

        this.propertyType.options = ['All'].concat(this.dPropertyType.group().reduceCount().all().map(v => v.key))
        this.propertyType.value = this.propertyType.options[0]

        this.country.options = ['All'].concat(this.dCountry.group().reduceCount().all().map(v => v.key))
        this.country.value = this.country.options[0]

        this.refreshCounters()
        this.refreshCharts()
        this.refreshMap(this.dYear)
      })
  },
  methods: {
    refreshCounters() {
      this.numRecords = this.cf.groupAll().reduceCount().value()
    },
    refreshCharts() {
      this.dataYear = this.dYear.group().reduceCount().all()
      this.dataPropertyType = this.dPropertyType.group().reduceCount().all()
      this.dataCountry = this.dCountry.group().reduceCount().all()
    },
    refreshMap(cfDimension) {
      this.pointCollection = this.getGeoJsonFromReports(cfDimension.top(Infinity))
    },
    getGeoJsonFromReports(reports) {
      const fc = {
        type: 'FeatureCollection',
        features: reports
          .filter(d => d.Latitude && d.Longitude)
          .map(d => ({
            type: 'Feature',
            properties: {
              Property_type: d.Property_type,
              City: d.City,
              State: d.State,
              Country: d.Country,
              year: d.year
            },
            geometry: {
              type: 'Point',
              coordinates: [d.Longitude, d.Latitude] // Обратите внимание: порядок [long, lat]
            }
          }))
      }
      return fc
    }
  },
  watch: {
    year: {
      handler(newVal) {
        if (newVal.value === 'All') {
          this.dYear.filter(null)
        } else {
          this.dYear.filter(newVal.value)
        }
        this.refreshCharts()
      },
      deep: true
    },
    propertyType: {
      handler(newVal) {
        if (newVal.value === 'All') {
          this.dPropertyType.filter(null)
        } else {
          this.dPropertyType.filter(newVal.value)
        }
        this.refreshCharts()
      },
      deep: true
    },
    country: {
      handler(newVal) {
        if (newVal.value === 'All') {
          this.dCountry.filter(null)
        } else {
          this.dCountry.filter(newVal.value)
        }
        this.refreshCounters()
        this.refreshCharts()
        this.refreshMap(this.dCountry)
      },
      deep: true
    }
  }
}
</script>

<!-- <style scoped>
.dashboard {
  display: flex;
  flex-direction: row;
}

.left-panel {
  flex: 2;
  max-width: 40vw;
  background-color: #f0f0f0;
}

.right-panel {
  flex: 1;
  padding: 1rem;
  max-width: 60vw;
  overflow-y: auto;
  background-color: #f0f0f0;
}
</style> -->
<style scoped>

</style>

