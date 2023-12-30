<template>
  <div class="aside-menu">
    <a-menu
      :default-selected-keys="menuList[0].key"
      :style="{ width: '100%' }"
      @menu-item-click="onClickMenuItem"
    >
      <a-menu-item v-for="menu in menuList" :key="menu.key">
        <icon-font :type="menu.icon" />
        {{ menu.title }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import localCache from '@/utils/cache'

import * as pageUrl from '@/constant/page-url-constants'

import { IAsideMenu } from '@/types/typing'

const isAdmin = localCache.getCache('isAdmin')

const menuList: IAsideMenu[] = reactive(
  [
    {
      key: pageUrl.PAGE_URL_MEETING_ROOM_LIST,
      icon: 'icon-list',
      title: '会议室列表',
      isAdmin: false
    },
    {
      key: pageUrl.PAGE_URL_MEETING_ROOM_HISTORY,
      icon: 'icon-calendar-clock',
      title: '预定历史',
      isAdmin: false
    },
    {
      key: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_LIST,
      icon: 'icon-unordered-list',
      title: '会议室管理',
      isAdmin: true
    },
    {
      key: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_BOOK,
      icon: 'icon-bookmark',
      title: '预定管理',
      isAdmin: true
    },
    {
      key: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_USER,
      icon: 'icon-user-group',
      title: '用户管理',
      isAdmin: true
    },
    {
      key: pageUrl.PAGE_URL_ADMIN_MEETING_ROOM_STATISTICS,
      icon: 'icon-apps',
      title: '统计',
      isAdmin: true
    }
  ].filter((item): boolean => item.isAdmin === isAdmin)
)

const router = useRouter()
const onClickMenuItem = (key: string) => {
  router.push(key)
}
</script>

<style lang="less" scoped></style>
