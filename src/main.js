import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './components/router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import  { store } from './stores/sellerApiStore.js'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App).use(router).use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios) 
app.mount('#app')
