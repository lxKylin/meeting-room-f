import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import * as pageUrl from '@/constant/page-url-constane'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: pageUrl.PAGE_URL_LOGIN,
    component: () => import('@/views/login.vue'),
    children: []
  },
  {
    path: pageUrl.PAGE_URL_LOGIN,
    name: pageUrl.PAGE_URL_LOGIN,
    component: () => import('@/views/login.vue')
  },
  {
    path: pageUrl.PAGE_URL_REGISTER,
    name: pageUrl.PAGE_URL_REGISTER,
    component: () => import('@/views/register.vue')
  },
  {
    path: pageUrl.PAGE_URL_RESET_PASSWORD,
    name: pageUrl.PAGE_URL_RESET_PASSWORD,
    component: () => import('@/views/reset-pwd.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 路由守卫

export default router
