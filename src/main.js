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
import VvUI from 'vvui' // 引入组件库
import '../node_modules/VVUI/packages/theme-default/lib/index.css' // 引入样式库

Vue.use(VvUI)
fastclick.attach(document.body)

// Vue.use(Skeleton)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
let app = new Vue({
  router,
  store,
  render: h => h(App)
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
