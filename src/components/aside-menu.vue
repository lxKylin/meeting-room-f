<template>
  <div class="aside-menu">
    <a-menu
      :default-selected-keys="[PAGE_URL_MEETING_ROOM_LIST]"
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

import {
  PAGE_URL_MEETING_ROOM_LIST,
  PAGE_URL_MEETING_ROOM_HISTORY
} from '@/constant/page-url-constants'

const menuList = reactive([
  {
    key: PAGE_URL_MEETING_ROOM_LIST,
    icon: 'icon-list',
    title: '会议室列表'
  },
  {
    key: PAGE_URL_MEETING_ROOM_HISTORY,
    icon: 'icon-calendar-clock',
    title: '预定历史'
  }
])

const router = useRouter()
const onClickMenuItem = (key: string) => {
  router.push(key)
}
</script>

<style lang="less" scoped></style>
