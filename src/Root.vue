<template>
  <div>
    <div style="padding: 1rem; background: #eee; background-color: hsla(160, 30%, 50%, 1);">
      <!-- <label style="margin-left: 1rem;">
        <input type="radio" value="old" v-model="selected" />
        Old version 
      </label>
      <label>
        <input type="radio" value="new" v-model="selected" />
        New version
      </label> -->
      <label>
        <input type="radio" value="newold" v-model="selected" />
        New old version
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
    //NewApp,
    //OldApp,
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