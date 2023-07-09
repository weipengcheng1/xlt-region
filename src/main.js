import Vue from 'vue'
import App from './App.vue'
// import xltRegion from "../dist/city-region-no-street.umd"

Vue.config.productionTip = false

// Vue.use(xltRegion)
new Vue({
    render: h => h(App),
}).$mount('#app')
