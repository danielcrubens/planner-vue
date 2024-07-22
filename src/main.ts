import { createApp } from 'vue';
import '../style.css';
import App from './App.vue';
import router from './router';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.component('VueDatePicker', VueDatePicker);
app.use(router);
app.use(pinia);
app.mount('#app');
