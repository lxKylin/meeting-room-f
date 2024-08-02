<template>
  <div class="login">
    <div class="login__main">
      <h1 class="login__main__title">
        {{ `会议室预定系统` }}
      </h1>
      <el-form
        ref="formRef"
        class="login__main__form"
        :model="form"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <div class="login__main__footer">
        <div class="login__main__footer--top">
          <span @click="toResetPwdPage">忘记密码</span>
          <span @click="toRegisterPage">注册</span>
        </div>
        <el-button type="primary" @click="doLogin" style="width: 100%">
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'

import {
  PAGE_URL_REGISTER,
  PAGE_URL_RESET_PASSWORD,
  PAGE_URL_MEETING_ROOM,
  PAGE_URL_ADMIN_MEETING_ROOM_LIST
} from '@/constant/page-url-constants'
import { login } from '@/services/user-service'
import localCache from '@/utils/cache'

const router = useRouter()

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})

const toRegisterPage = () => {
  router.push(PAGE_URL_REGISTER)
}
const toResetPwdPage = () => {
  router.push(PAGE_URL_RESET_PASSWORD)
}

// 使用全局的 message 组件
let message = ref<any>(null)
onMounted(() => {
  message.value =
    getCurrentInstance()?.appContext.config.globalProperties.$message
})

const doLogin = () => {
  formRef.value!.validate((valid) => {
    if (valid) {
      login(form.value.username, form.value.password)
        .then((res) => {
          message.value.success('登录成功')
          const data = res.data
          localCache.setCache('accessToken', data.accessToken)
          localCache.setCache('refreshToken', data.refreshToken)
          localCache.setCache('userInfo', data.userInfo)
          setTimeout(() => {
            router.push(
              data.userInfo.isAdmin
                ? PAGE_URL_ADMIN_MEETING_ROOM_LIST
                : PAGE_URL_MEETING_ROOM
            )
          }, 1000)
        })
        .catch((err) => {
          message.value.error(err.msg || '登录失败')
        })
    }
  })
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/img/login-bg.svg');
  &__main {
    width: 400px;
    padding: 20px;
    margin-top: -100px;
    &__title {
      text-align: center;
      margin-bottom: 50px;
    }
    &__footer {
      margin-left: 70px;
      &--top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        span {
          color: #1890ff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
