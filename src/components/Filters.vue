<template>
  <div class="space-y-4">
    <div>
      <label>Year</label>
      <select :value="filters.host_since_year.value" @change="emitFilter('host_since_year', $event.target.value)">
        <option v-for="opt in filters.host_since_year.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
    <div>
      <label>Country</label>
      <select :value="filters.Country.value" @change="emitFilter('Country', $event.target.value)">
        <option v-for="opt in filters.Country.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
    <div>
      <label>State</label>
      <select :value="filters.State.value" @change="emitFilter('State', $event.target.value)">
        <option v-for="opt in filters.State.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
    <div>
      <label>City</label>
      <select :value="filters.City.value" @change="emitFilter('City', $event.target.value)">
        <option v-for="opt in filters.City.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  props: ['filters'],
  methods: {
    emitFilter(key, value) {
      this.$emit('updateFilter', { key, value });
    }
  }
};
</script>


<style scoped>
label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
select {
  width: 100%;
  padding: 0.25rem;
}
</style>
