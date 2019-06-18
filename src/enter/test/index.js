/** The Vue build version to load with the `import` command
 * 管理中心
 * **/

import Vue from 'vue'
import App from './App'
import router from '../../router/test'
import ElementUI from 'element-ui'
import '../../../node_modules/element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'

import routes from '../../data/routes.json'


sessionStorage.setItem('routes',JSON.stringify(routes)); //存储路由到localStorage
console.log( routes )

Vue.config.debug = true
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueQuillEditor);

router.beforeEach((to, from, next) => {
  //to即将进入的目标路由对象，from当前导航正要离开的路由， next : 下一步执行的函数钩子
  if(to.path === '/' || to.path === '/register') {
    next();
  } else {
    if(!sessionStorage.getItem('accessToken')) {
      alert("请重新登录！")
      next({ path: '/' })
    } else {
      next()
    }}
});

//routes.beforeEach((to,from,next)=>{
//  if (!routes) {//不加这个判断，路由会陷入死循环
//    if (!getStore('routes')) {
//      routerGo(to, next)//执行路由跳转方法
//      sessionStorage.setItem('routes',routes); //存储路由到localStorage
//    } else {//从localStorage拿到了路由
//      routes = sessionStorage.getItem('routes')//拿到路由
//      routerGo(to, next)
//    }
//  } else {
//    next()
//  }
//})
//function routerGo(to, next) {
//  debugger;;
//  //routes = filterAsyncRouter(routes) //过滤路由
//  router.addRoutes(routes[0]) //动态添加路由
//  global.antRouter = routes //将路由数据传递给全局变量，做侧边栏菜单渲染工作
//  next({ ...to, replace: true })
//}


new Vue({
  el: '#app',
  router:router,
  components: { App },
  template: '<App/>'
})
