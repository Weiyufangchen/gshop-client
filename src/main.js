// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {Button} from 'mint-ui'

import App from './App'
import router from './router'
import store from './store'
import Split from './components/Split/Split'

// 引入mock文件
import './mock/mockServer'
// 加载自定义过滤器
import './filters'


// Vue.config.productionTip = false
// 注册全局组件标签
Vue.component(Button.name, Button) // 第一个参数为字符串名
Vue.component('Split', Split) // 第一个参数为字符串名


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
