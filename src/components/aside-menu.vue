<template>
  <div class="aside-menu">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="" />
    </div>
    <el-menu
      :default-active="defaultActive"
      class="pt20"
      @select="handleSelect"
    >
      <div v-for="menu in menuList" :key="menu.path">
        <!-- <el-submenu v-show="!menu.children" :index="menu.path">
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="second in menu.children"
            v-show="!menu.children"
            :path="second.path"
            :index="second.path"
          >
            <span>{{ second.title }}</span>
          </el-menu-item>
        </el-submenu> -->
        <el-menu-item v-show="menu.children" :index="menu.path">
          <template #title>
            <el-icon><component :is="menu.icon" /></el-icon>
            {{ menu.title }}
          </template>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import localCache from '@/utils/cache'

import * as pageUrl from '@/constant/page-url-constants'
const isAdmin = localCache.getCache('isAdmin')

const defaultActive: string = isAdmin
  ? pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_LIST
  : pageUrl.PAGE_URL_MEETING_ROOM_LIST

const menuList = reactive(
  [
    {
      path: pageUrl.PAGE_URL_MEETING_ROOM_LIST,
      label: '会议室列表',
      title: '会议室列表',
      isAdmin: false,
      icon: 'Menu',
      children: []
    },
    {
      path: pageUrl.PAGE_URL_MEETING_ROOM_HISTORY,
      label: '预定历史',
      title: '预定历史',
      isAdmin: false,
      icon: 'Histogram',
      children: []
    },
    {
      path: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_LIST,
      label: '会议室管理',
      title: '会议室管理',
      isAdmin: true,
      icon: 'Memo',
      children: []
    },
    {
      path: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_BOOK,
      label: '预定管理',
      title: '预定管理',
      isAdmin: true,
      icon: 'Notebook',
      children: []
    },
    {
      path: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_USER,
      label: '用户管理',
      title: '用户管理',
      isAdmin: true,
      icon: 'UserFilled',
      children: []
    },
    {
      path: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_STATISTICS,
      label: '统计',
      title: '统计',
      isAdmin: true,
      icon: 'TrendCharts',
      children: []
    }
  ].filter((item): boolean => item.isAdmin === isAdmin)
)

const router = useRouter()
const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<style lang="less" scoped>
.aside-menu {
  .logo {
    height: 42px;
    line-height: 42px;
    display: flex;
    justify-content: center;
    border-right: 1px solid var(--el-menu-border-color);
  }
  .el-menu {
    height: calc(100vh - 42px);
  }
}
</style>
