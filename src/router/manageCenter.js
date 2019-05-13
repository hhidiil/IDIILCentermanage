import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// 导入相应的子组件
import Door from '../page/manageCenter/door'
import Home from '../page/manageCenter/home.vue'
import RegisterPage from '../page/manageCenter/register.vue'
import defaultPage from './../page/manageCenter/default'
import TeacherManage from '../page/manageCenter/TeacherManage.vue'
import StudentManage from '../page/manageCenter/StudentManage.vue'
import CenterManage from '../page/manageCenter/CenterManage.vue'
import projectManage from '../page/manageCenter/projectManage.vue'

const routes = [
  {
    path: '/',
    name: 'door',
    component: Door
  },{
    path: '/register',
    name: 'register',
    component: RegisterPage
  },{
    path: '/editMember',
    name: 'editMember',
    component:(resolve) => require(['../page/manageCenter/editMember.vue'], resolve),
  },{
    path: '/home',
    component: Home,
    children:[
      {
        path:'',
        name:'defaultPage',
        component:defaultPage,
      },{
        path: 'teacherManage',
        name: 'teacherManage',
        component: TeacherManage,
        meta:['班级管理']
      },{
        path: 'studentManage',
        name: 'studentManage',
        component: StudentManage,
        meta:['学生管理']
      },{
        path: 'centerManage',
        name: 'centerManage',
        component: CenterManage,
        meta:['中心用户管理']
      },{
        path: 'projectManage',
        name: 'projectManage',
        component: projectManage,
        meta:['me练习']
      },{
        path:'generalCenterList',
        name:'generalCenterList',
        component:(resolve) => require(['../page/manageCenter/generalList.vue'], resolve),
        meta:['总中心列表']
      },{
        path:'subCenterList',
        name:'subCenterList',
        component:(resolve) => require(['../page/manageCenter/subCenterList.vue'], resolve),
        meta:['分中心列表']
      },{
        path:'adminList',
        name:'adminList',
        component:(resolve) => require(['../page/manageCenter/adminList.vue'], resolve),
        meta:['管理员列表']
      },{
        path:'schoolList',
        name:'schoolList',
        component:(resolve) => require(['../page/manageCenter/SchoolList.vue'], resolve),
        meta:['学校管理']
      },{
        path:'classList',
        name:'classList',
        component:(resolve) => require(['../page/manageCenter/ClassList.vue'], resolve),
        meta:['班级管理']
      },{
        path:'schoolUserManage',
        name:'schoolUserManage',
        component:(resolve) => require(['../page/manageCenter/schoolUserManage.vue'], resolve),
        meta:['教务管理']
      },{
        path:'reportManage',
        name:'reportManage',
        component:(resolve) => require(['../page/manageCenter/reportManage.vue'], resolve),
        meta:['报表管理']
      }
    ]
  }
]
export default new Router({
  routes: routes,
  strict: process.env.NODE_ENV !== 'production'
})
