import Vue from 'vue'
import Router from 'vue-router'

// 导入相应的子组件
import door from './../page/faXianShiShuXue/door'
import manage from './../page/faXianShiShuXue/manage'
import HomePage from './../page/faXianShiShuXue/home'
import defaultPage from './../page/faXianShiShuXue/default'
import addClassManager from './../page/faXianShiShuXue/classManager'
import classManagerList from './../page/faXianShiShuXue/classManagerList'
import classTeam from './../page/faXianShiShuXue/classTeam'
import editorVue from './../page/faXianShiShuXue/editor'
import sendLessons from './../page/faXianShiShuXue/sendLessons'
import attendClass from './../page/faXianShiShuXue/attendClass'
import practice from './../page/faXianShiShuXue/practice'

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'door',
    component: door
  }, {
    path: '/home',
    name: 'home',
    component: HomePage
  }, {
    path: '/manage',
    component: manage, // 当route 有子route时，为了显示子路由的默认页面，则父路由不能有name属性
    children: [
      {
        path: '',
        name: 'defaultPage',
        component: defaultPage,
        meta: []
      }, {
        path: '/addClassManager',
        name: 'addClassManager',
        component: addClassManager,
        meta: ['备课管理', '添加备课']
      }, {
        path: 'classManagerList',
        name: 'classManagerList',
        component: classManagerList,
        meta: ['备课管理', '课程列表']
      }, {
        path: 'classTeam',
        name: 'classTeam',
        component: classTeam,
        meta: ['备课管理', '派课列表']
      }, {
        path: '/sendLessons',
        name: 'sendLessons',
        component: sendLessons,
        meta: ['备课管理', '派课列表']
      }, {
        path: 'attendClass',
        name: 'attendClass',
        component: attendClass,
        meta: ['备课管理', '上课列表']
      }, {
        path: 'practice',
        name: 'practice',
        component: practice,
        meta: ['备课管理', '练习']
      }, {
        path: 'editor',
        component: editorVue,
        meta: ['编辑器']
      }
    ]
  }
]
export default new Router({
  routes: routes,
  strict: process.env.NODE_ENV !== 'production'
})
