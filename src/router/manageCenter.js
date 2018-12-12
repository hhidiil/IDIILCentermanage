import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 导入相应的子组件
import Home from './../page/faXianShiShuXue/door'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]
export default new Router({
  routes: routes,
  strict: process.env.NODE_ENV !== 'production'
})
