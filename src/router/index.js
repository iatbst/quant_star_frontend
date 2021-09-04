import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '系统首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '系统首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/balances',
    component: Layout,
    redirect: '/balances/summary',
    name: '资金管理',
    meta: { title: '资金管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'summary',
        name: 'Summary',
        component: () => import('@/views/balance/index'),
        meta: { title: '资金管理', icon: 'el-icon-money' }
      }
    ]
  },

  {
    path: '/positions',
    component: Layout,
    redirect: '/positions/summary',
    name: '仓位水平',
    meta: { title: '仓位水平', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'summary',
        name: 'Summary',
        component: () => import('@/views/position/index'),
        meta: { title: '仓位水平', icon: 'el-icon-s-data' }
      }
    ]
  },

  {
    path: '/performances',
    component: Layout,
    redirect: '/performances/summary',
    name: '策略表现',
    meta: { title: '策略表现', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'summary',
        name: 'Summary',
        component: () => import('@/views/performance/index'),
        meta: { title: '策略表现', icon: 'el-icon-data-analysis' }
      }
    ]
  },

  {
    path: '/worker-runs',
    component: Layout,
    redirect: '/worker-runs',
    name: '策略运行',
    meta: { title: '策略运行', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'worker-runs',
        name: 'WorkerRuns',
        component: () => import('@/views/worker_run/index'),
        meta: { title: '策略运行', icon: 'el-icon-loading' }
      }
    ]
  },

  {
    path: '/bars',
    component: Layout,
    redirect: '/bars',
    name: '历史K线',
    meta: { title: '历史K线', icon: 'el-icon-check' },
    children: [
      {
        path: 'bars',
        name: 'Bars',
        component: () => import('@/views/bar/index'),
        meta: { title: '历史K线', icon: 'el-icon-s-marketing' }
      }
    ]
  },

  {
    path: '/monitors',
    component: Layout,
    redirect: '/monitors/basics',
    name: '系统监控',
    meta: { title: '系统监控', icon: 'el-icon-odometer' },
    children: [
      {
        path: 'basics',
        name: 'Basics',
        component: () => import('@/views/monitor/basic/index'),
        meta: { title: '系统运行', icon: 'el-icon-view' }
      },
      {
        path: 'positions_signals',
        name: 'Positions_Signals',
        component: () => import('@/views/monitor/position_signal/index'),
        meta: { title: '仓位/信号', icon: 'el-icon-bell' }
      },
      {
        path: 'errors',
        name: 'Errors',
        component: () => import('@/views/monitor/error/index'),
        meta: { title: '警报事件', icon: 'el-icon-warning' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
