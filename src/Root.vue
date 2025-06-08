<template>
  <div>
    <div style="padding: 1rem; background: #eee; background-color: hsla(160, 30%, 50%, 1);">
      <label style="margin-left: 1rem;">
        <input type="radio" value="old" v-model="selected" />
        Old version 
      </label>
      <label>
        <input type="radio" value="new" v-model="selected" />
        New version
      </label>
    </div>

    <component :is="selectedApp" />
  </div>
</template>

<script>
import OldApp from './App_old.vue';
import NewApp from './App.vue';

export default {
  name: 'Root',
  components: {
    NewApp,
    OldApp,
  },
  data() {
    return {
      selected: 'old',
    };
  },
  computed: {
    selectedApp() {
      return this.selected === 'new' ? 'NewApp' : 'OldApp';
    },
  },
};
</script>

<style scoped>
label {
  cursor: pointer;
}
/* .root-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.sidebar {
  width: 500px;
  background-color: #ddd;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-content {
  flex: 1;
  overflow: auto;
} */
</style>
