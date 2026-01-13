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
      name: '首页',
      component: () => import('@/views/dashboard/v2/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/report',
    children: [
      {
        path: '/report',
        name: '报告',
        component: () => import('@/views/report/index'),
        meta: { title: '报告', icon: 'el-icon-document-copy' }
      }
    ]
  },

  {
    path: '/position',
    component: Layout,
    redirect: '/position',
    name: '仓位',
    meta: { title: '仓位', icon: 'el-icon-wind-power' },
    children: [
      {
        path: 'position',
        name: '仓位',
        component: () => import('@/views/position/index'),
        meta: { title: '仓位', icon: 'el-icon-wind-power' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/orders',
    children: [
      {
        path: '/orders',
        name: '订单',
        component: () => import('@/views/orders/index'),
        meta: { title: '订单', icon: 'el-icon-s-order' }
      }
    ]
  },

  {
    path: '/performances',
    component: Layout,
    redirect: '/performances/all',
    name: '策略',
    meta: { title: '策略', icon: 'el-icon-s-data' },
    children: [
      {
        path: '/performances/all',
        name: '总体',
        component: () => import('@/views/performance/v2/all_perf'),
        meta: { title: '总体', icon: 'el-icon-document' }
      },
      {
        path: '/performances/tb',
        name: 'TB',
        component: () => import('@/views/performance/v2/tb_perf'),
        meta: { title: 'TB', icon: 'el-icon-s-marketing' }
      },
      {
        path: '/performances/in',
        name: 'IN',
        component: () => import('@/views/performance/v2/in_perf'),
        meta: { title: 'IN', icon: 'el-icon-s-marketing' }
      },
      {
        path: '/performances/pm',
        name: 'PM',
        component: () => import('@/views/performance/v2/pm_perf'),
        meta: { title: 'PM', icon: 'el-icon-s-marketing' }
      },
      {
        path: '/performances/rsi',
        name: 'RS',
        component: () => import('@/views/performance/v2/rsi_perf'),
        meta: { title: 'RSI', icon: 'el-icon-s-marketing' }
      },
      {
        path: '/performances/pb',
        name: 'PB',
        component: () => import('@/views/performance/v2/pb_perf'),
        meta: { title: 'PB', icon: 'el-icon-s-marketing' }
      },
      {
        path: '/performances/offline',
        name: '下线策略',
        component: () => import('@/views/performance/v2/offline_perf'),
        meta: { title: '下线策略', icon: 'el-icon-s-marketing' }
      }
    ]
  },

  {
    path: '/worker-runs',
    component: Layout,
    redirect: '/worker-runs',
    name: '策略执行',
    meta: { title: '策略执行', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'worker-runs',
        name: '运行中',
        component: () => import('@/views/worker_run/index'),
        meta: { title: '运行中', icon: 'el-icon-loading' }
      },
      {
        path: 'worker-runs?status=offline',
        name: '已下线',
        component: () => import('@/views/worker_run/index'),
        meta: { title: '已下线', icon: 'el-icon-remove' }
      }
    ]
  },

  {
    path: '/fee',
    component: Layout,
    redirect: '/fee/fees',
    name: '费用统计',
    meta: { title: '费用统计', icon: 'el-icon-pie-chart' },
    children: [
      {
        path: 'fees',
        name: '交易费',
        component: () => import('@/views/fee/fees/index'),
        meta: { title: '交易费用', icon: 'el-icon-money' }
      },
      {
        path: 'volumes',
        name: '成交量',
        component: () => import('@/views/fee/volumes/index'),
        meta: { title: '成交量', icon: 'el-icon-data-line' }
      },
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
        path: 'open_trades',
        name: 'Open_Trades',
        component: () => import('@/views/monitor/open_trade/index'),
        meta: { title: '交易监控', icon: 'el-icon-bell' }
      },  
      {
        path: 'backtest',
        name: 'Backtest',
        component: () => import('@/views/monitor/backtest/index'),
        meta: { title: '回测对比', icon: 'el-icon-data-analysis' }
      },               
      {
        path: 'errors',
        name: 'Errors',
        component: () => import('@/views/monitor/error/index'),
        meta: { title: '警报事件', icon: 'el-icon-warning' }
      }
    ]
  },

  {
    path: '/other_settings',
    component: Layout,
    redirect: '/other_settings',
    name: '其他设置',
    meta: { title: '其他设置', icon: 'el-icon-s-operation' },
    children: [
      {
        path: 'product_leverages',
        name: '仓位档位',
        component: () => import('@/views/other_settings/product_leverages/index'),
        meta: { title: '仓位档位', icon: 'el-icon-s-operation' }
      }
    ]
  },

  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/pnl',
    name: '收益分析',
    meta: { title: '收益分析', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: '/analysis/pnl_live',
        name: '实盘收益',
        component: () => import('@/views/analysis/pnl_live'),
        meta: { title: '实盘收益', icon: 'el-icon-data-analysis' }
      },
      {
        path: '/analysis/pnl',
        name: '实盘VS回测',
        component: () => import('@/views/analysis/pnl'),
        meta: { title: '实盘VS回测', icon: 'el-icon-data-analysis' }
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
