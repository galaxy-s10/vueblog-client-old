import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.css'
// import './assets/js/main.js'
import './utils/tip'

import router from './router/index.js'
import store from './store'
// import jindutiao from './utils/jindutiao'
import './utils/jindutiao'

import axios from 'axios'
Vue.prototype.axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
