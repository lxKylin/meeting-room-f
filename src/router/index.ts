import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import * as PAGE_URL from '@/constant/page-url-constants'

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
    path: PAGE_URL.PAGE_URL_LOGIN,
    name: PAGE_URL.PAGE_URL_LOGIN,
    meta: {
      title: '登录'
    },
    component: () => import('@/views/user/login.vue')
  },
  {
    path: PAGE_URL.PAGE_URL_ADMIN_LOGIN,
    name: PAGE_URL.PAGE_URL_ADMIN_LOGIN,
    meta: {
      title: '管理员登录'
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

router.afterEach((to) => {
  // 修改当前标签页的名称
  const title = to.meta.title
  const titleNode = document.querySelector('head > title')
  if (title && titleNode) {
    titleNode.textContent = title.toString()
  }
})
// 路由守卫

export default router
