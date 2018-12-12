import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 导入相应的子组件
import door from './../page/door'
import HomePage from './../page/home'


const routes = [
  {
    path: '/',
    name: 'door',
    component: door
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
