import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'



Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/Login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home,

    // 路由重定向使一进入到页面，就直接跳转到重定向的页面去，路由重定向这里必须写完整的路径  /home/welcome
    redirect: '/home/welcome',
    children:[
      {
        // 注意这里不能写成/welcome，
        path:'welcome',
        component: Welcome
      },
      {
        path:'users',
        component: Users
      },
      {
        path:'rights',
        component: Rights
      },
      {
        path:'roles',
        component: Roles
      },
      {
        path:'categories',
        component: Cate
      },
      {
        path:'params',
        component: Params
      },
      {
        path:'goods',
        component:List
      },
      {
        path:'goods/add',
        component:Add
      }
    ]
  }
  
]

const router = new VueRouter({
  routes
})

// 开启路由守卫
router.beforeEach((to,from,next)=>{
  if(to.path === '/login')return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
