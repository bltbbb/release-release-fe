import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/Login'
import Layout from '@/views/Layout/Layout'
import IPList from '@/views/IPList'
import UserList from '@/views/UserList/UserList'
import GroupMan from '@/views/GroupMan/GroupMan'
import PassWord from '@/views/PassWord/PassWord'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/IPList/index',
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/IPList',
      component: Layout,
      redirect: '/IPList/index',
      children: [{
        path: 'index',
        component: IPList,
        name: 'IPList',
        meta: { title: '授权管理', icon: 'IPList', noCache: true, requiresAuth: true }
      }]
    },
    {
      path: '/GroupMan',
      component: Layout,
      redirect: '/GroupMan/index',
      children: [{
        path: 'index',
        component: GroupMan,
        name: 'GroupMan',
        meta: { title: '邮件群组', icon: 'GroupMan', noCache: true, requiresAuth: true }
      }]
    },
    {
      path: '/UserList',
      component: Layout,
      redirect: '/UserList/index',
      children: [{
        path: 'index',
        component: UserList,
        meta: { title: '版本列表', icon: 'UserList', noCache: true, requiresAuth: true }
      }]
    },
    {
      path: '/PassWord',
      component: PassWord,
      name: 'PassWord',
      meta: { title: '修改密码', icon: 'UserList', noCache: true, requiresAuth: false }
    },
  ]
})
