<template>
  <div>
    <div style="padding: 1rem; background: #eee; background-color: '#666666';">
      <label>
        <img src="/Airbnb_Logo.png" style="height: 30px; vertical-align: middle; margin-right: 10px;" />
        <h5  class="headings_color"> data from https://www.kaggle.com/datasets/joebeachcapital/airbnb</h5>
      </label>
    </div>

    <component :is="selectedApp" />
  </div>
</template>

<script>
//import OldApp from './App_old.vue';
//import NewApp from './App.vue';
import NewOldApp from './Main_app.vue';

export default {
  name: 'Root',
  components: {
    NewOldApp,
  },
  data() {
    return {
      selected: 'newold',
    };
  },
  computed: {
    selectedApp() {
      switch(this.selected) {
        // case 'new':
        //   return 'NewApp';
        // case 'old':
        //   return 'OldApp';
        default:
          return 'NewOldApp';
      }
    },
  },
};
</script>

<style scoped>
label {
  cursor: pointer;
  margin-right: 1rem; /* Добавил отступ между радиокнопками */
}
</style>