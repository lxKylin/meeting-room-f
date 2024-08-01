<template>
  <div class="header">
    <header class="header__wrapper">
      <div class="header__wrapper__logo">
        {{ isAdmin ? '会议室预定系统后台' : '会议室预定系统' }}
      </div>
      <div class="header__wrapper__menu">
        <div class="header__wrapper__menu-item">Home</div>
        <div class="header__wrapper__menu-item">About</div>
        <div class="header__wrapper__menu-item">Contact</div>
      </div>
      <div class="header__wrapper__user">
        <el-avatar
          class="header__wrapper__user-avatar"
          :size="32"
          :src="avatarUrl"
        ></el-avatar>
        <el-dropdown>
          <div class="header__wrapper__user-name">
            {{ nickName || 'Kylin' }}
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(dropTion, index) in dropTionList"
                :key="index"
                :icon="dropTion.icon"
                @click="handleDoptionClick(dropTion.path)"
              >
                {{ dropTion.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import localCache from '@/utils/cache'
import { useStore } from '@/store'
import {
  PAGE_URL_USER_PROFILE,
  PAGE_URL_LOGIN,
  PAGE_URL_ADMIN_LOGIN
} from '@/constant/page-url-constants'
import { getUserInfo } from '@/services/user-service'

const store = useStore()

const isAdmin = localCache.getCache('isAdmin')

const nickName = ref<string>('')
const avatarUrl = ref<string>('')
onMounted(() => {
  getUserInfo().then((res) => {
    nickName.value = res.data.nickName || ''
    store.setHeadPic(res.data.headPic)
    avatarUrl.value = store.headPic
  })
})
const router = useRouter()
const dropTionList = reactive([
  {
    path: PAGE_URL_USER_PROFILE,
    icon: 'Avatar',
    title: '个人信息'
  },
  {
    path: isAdmin ? PAGE_URL_ADMIN_LOGIN : PAGE_URL_LOGIN,
    icon: 'SwitchButton',
    title: '退出登录'
  }
])
const handleDoptionClick = (path: string) => {
  if (path === PAGE_URL_LOGIN) {
    localCache.clearCache()
    router.push(path)
  } else {
    router.push(path)
  }
}
</script>

<style lang="less" scoped>
.header {
  .header__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .header__wrapper__logo {
      font-size: 20px;
      font-weight: bold;
    }
    .header__wrapper__menu {
      display: flex;
      .header__wrapper__menu-item {
        margin: 0 10px;
        cursor: pointer;
      }
    }
    .header__wrapper__user {
      display: flex;
      align-items: center;
      cursor: pointer;
      .header__wrapper__user-avatar {
        margin: 0 10px;
      }
      .header__wrapper__user-name {
        color: #1d2129;
      }
    }
  }
}
</style>
