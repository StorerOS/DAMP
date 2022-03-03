import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export { getPermissionsRoutes, getRouteEnds, getPermissionsFirstRouterPath } from './utils'

const componentRouterView = {
  render(h) { return h('router-view') }
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const asyncRoutes = [
  {
    path: '/account',
    component: Layout,
    redirect: '/account/index',
    children: [{
      path: '/account/index',
      name: 'Account',
      component: () => import('@/views/home'),
      meta: { title: '账户', icon: 'shouye' }
    }]
  },
  {
    path: '/address',
    component: Layout,
    redirect: '/address/index',
    children: [{
      path: '/address/index',
      name: 'AddressListLayout',
      component: () => import('@/views/address'),
      meta: { title: '地址簿', icon: 'shouye' }
    }]
  },
  {
    path: '/alert',
    component: Layout,
    meta: { title: '告警管理', icon: 'shouye' },
    redirect: '/alert/index',
    children: [{
      path: '/alert/rules',
      name: 'AlertRules',
      component: () => import('@/views/alert/rules'),
      meta: { title: '告警规则' }
    }, {
      path: '/alert/index',
      name: 'Alert',
      component: () => import('@/views/alert'),
      meta: { title: '告警通知' }
    }]
  },
  {
    path: '/overview',
    component: Layout,
    redirect: '/overview/index',
    children: [{
      path: '/overview/index',
      name: 'Overview',
      component: () => import('@/views/overview'),
      meta: { title: '总览', icon: 'shouye' }
    }]
  },
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo',
    hidden: true,
    children: [{
      path: '/userInfo',
      name: 'UserInfoLayout',
      component: () => import('@/views/userInfo'),
      meta: { title: '个人中心', icon: 'shouye' }
    }]
  }
]
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/403'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true },
  {
    path: '/',
    redirect: '/account/index',
    component: Layout
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
