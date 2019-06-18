import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// 导入相应的子组件
import Door from '../page/test/door.vue'

import Home from '../page/test/door.vue'

const routes = [
  {
    path: '/',
    name: 'door',
    component: Door
  },{
    path: '/test',
    name: 'test',
    component: Door
  }
]
export default new Router({
  routes: routes,
  strict: process.env.NODE_ENV !== 'production'
})
