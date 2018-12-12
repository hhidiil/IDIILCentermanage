import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 导入相应的子组件
import Door from './../page/main/door'
import HomePage from './../page/main/home'


const routes = [
  {
    path: '/',
    name: 'door',
    component: Door
  },{
    path: '/home',
    name: 'home',
    component:HomePage,
  }
]
export default new Router({
  routes: routes,
  strict: process.env.NODE_ENV !== 'production'
})
