// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
// import Skeleton from './base/skeleton/index'
import './common/stylus/index.styl'

fastclick.attach(document.body)

// Vue.use(Skeleton)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
let app = new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
})
if (process.env.NODE_ENV === 'development') {
  app.$mount('#app')
} else {
  window.mountApp = () => {
    app.$mount('#app')
  }
  if (window.STYLE_READY) {
    window.mountApp()
  }
}
