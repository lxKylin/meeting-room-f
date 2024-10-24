import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import * as PAGE_URL from '@/constant/page-url-constants'
import localCache from '@/utils/cache'

// 配置css动画类型与速度
NProgress.configure({ ease: 'linear', speed: 500 })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: PAGE_URL.PAGE_URL_MEETING_ROOM_LIST,
    component: () => import('@/views/user/login.vue'),
    children: []
  },
  {
    path: PAGE_URL.PAGE_URL_MEETING_ROOM,
    name: PAGE_URL.PAGE_URL_MEETING_ROOM,
    redirect: PAGE_URL.PAGE_URL_MEETING_ROOM_LIST,
    meta: {
      title: '会议室'
    },
    component: () => import('@/views/layout.vue'),
    children: [
      {
        path: PAGE_URL.PAGE_URL_MEETING_ROOM_LIST,
        name: PAGE_URL.PAGE_URL_MEETING_ROOM_LIST,
        meta: {
          title: '会议室列表'
        },
        component: () => import('@/views/meeting-room/list/room-list.vue')
      },
      {
        path: PAGE_URL.PAGE_URL_MEETING_ROOM_HISTORY,
        name: PAGE_URL.PAGE_URL_MEETING_ROOM_HISTORY,
        meta: {
          title: '会议室预定历史'
        },
        component: () => import('@/views/meeting-room/history/room-history.vue')
      },
      {
        path: PAGE_URL.PAGE_URL_USER_PROFILE,
        name: PAGE_URL.PAGE_URL_USER_PROFILE,
        meta: {
          title: '个人信息'
        },
        component: () => import('@/views/user/user-profile.vue')
      }
    ]
  },
  {
    path: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM,
    name: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM,
    redirect: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_LIST,
    meta: {
      title: '管理员后台'
    },
    component: () => import('@/views/layout.vue'),
    children: [
      {
        path: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_LIST,
        name: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_LIST,
        meta: {
          title: '会议室管理'
        },
        component: () => import('@/views/admin/room-list/room-list.vue')
      },
      {
        path: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_BOOK,
        name: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_BOOK,
        meta: {
          title: '预定管理'
        },
        component: () => import('@/views/admin/room-booking/room-booking.vue')
      },
      {
        path: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_USER,
        name: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_USER,
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/admin/room-user/room-user.vue')
      },
      {
        path: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_STATISTICS,
        name: PAGE_URL.PAGE_URL_ADMIN_MEETING_ROOM_STATISTICS,
        meta: {
          title: '统计'
        },
        component: () =>
          import('@/views/admin/room-statistics/room-statistics.vue')
      }
    ]
  },
  {
    path: PAGE_URL.PAGE_URL_LOGIN,
    name: PAGE_URL.PAGE_URL_LOGIN,
    meta: {
      title: '登录'
    },
    component: () => import('@/views/user/login.vue')
  },
  {
    path: PAGE_URL.PAGE_URL_REGISTER,
    name: PAGE_URL.PAGE_URL_REGISTER,
    meta: {
      title: '注册'
    },
    component: () => import('@/views/user/register.vue')
  },
  {
    path: PAGE_URL.PAGE_URL_RESET_PASSWORD,
    name: PAGE_URL.PAGE_URL_RESET_PASSWORD,
    meta: {
      title: '重置密码'
    },
    component: () => import('@/views/user/reset-pwd.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    meta: {
      title: 'error'
    },
    component: () => import('@/views/not-found/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((_, __, next) => {
  NProgress.start()
  next()
})

router.beforeEach((to, _, next) => {
  if (to.path !== PAGE_URL.PAGE_URL_LOGIN) {
    localCache.getCache('userInfo')
      ? next()
      : next({ path: PAGE_URL.PAGE_URL_LOGIN })
  } else {
    next()
  }
})

router.afterEach((to) => {
  // 修改当前标签页的名称
  const title = to.meta.title
  const titleNode = document.querySelector('head > title')
  if (title && titleNode) {
    titleNode.textContent = title.toString()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
