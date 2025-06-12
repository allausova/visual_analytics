import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import './assets/main.css';
import { createApp } from 'vue';
import Root from './Root.vue';

// createApp(Root).mount('#app');

const app = createApp(Root);

app.use(BootstrapVue3);  // вот это важно!

app.mount('#app');