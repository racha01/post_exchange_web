import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./components/router";

import axios from "axios";
import VueAxios from "vue-axios";
import { store } from "./store/seller.js";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import withUUID from "vue-uuid";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import vSelect from 'vue-select'


const app = withUUID(createApp(App));
app.component('VueDatePicker', VueDatePicker);
app.component('v-select', vSelect)
app.use(router);
app.use(store);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.mount("#app");
