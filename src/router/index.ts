import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 路由守卫

export default router
