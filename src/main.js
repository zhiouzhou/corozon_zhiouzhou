// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import 'lib-flexible'
import store from './assets/data/index'
import '@/api/index'
import $ from 'jquery'
// import './utils/flexible.js' 

import axios from 'axios'
Vue.use(ElementUI);


Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
router.beforeEach(function (to, from, next) {
  let hasToken = !!this.app.$options.store.state.user.access_token;
  console.log(hasToken)
  if (to.path === "/login" || to.path === "/resetPassword") {
    next();
  } else if (!hasToken) {
    next({ path: '/login', replace: true, query: { redirect: to.fullPath } });
  } else {
    next();
  }
}.bind(router));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
