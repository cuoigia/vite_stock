import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './index.css'

// createApp(App).use(router).use(store).use(VueAxios, axios).mount('#app')

const app = createApp(App).use(router).use(store)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.axios = axios
app.mount('#app')

