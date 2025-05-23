import Vue from 'vue'
import App from './App.vue'


import Vant from 'vant'
import 'vant/lib/index.css'

Vue.config.productionTip = false

Vue.use(Vant)

const app = new Vue({
  render: h => h(App),
})
app.$mount('#app')
