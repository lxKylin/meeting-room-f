<template>
  <div class="login">
    <div class="login__main">
      <h1 class="login__main__title">会议室预定系统</h1>
      <a-form
        ref="formRef"
        class="login__main__form"
        :model="form"
        :rules="rules"
        auto-label-width
      >
        <a-form-item field="username" label="用户名">
          <a-input
            v-model="form.username"
            placeholder="请输入用户名"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
            v-model="form.password"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <div class="login__main__footer">
        <div class="login__main__footer--top">
          <span @click="toResetPwdPage">忘记密码</span>
          <span @click="toRegisterPage">注册</span>
        </div>
        <a-button type="primary" @click="login">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ValidatedError } from '@arco-design/web-vue'

import {
  PAGE_URL_REGISTER,
  PAGE_URL_RESET_PASSWORD
} from '@/constant/page-url-constants'
import { userLogin } from '@/services/user-service'
import localCache from '@/utils/cache'

const formRef = ref()
const form = ref({
  username: '',
  password: ''
})

const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      validate: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      validate: 'blur'
    }
  ]
})

const router = useRouter()
const toRegisterPage = () => {
  router.push(PAGE_URL_REGISTER)
}
const toResetPwdPage = () => {
  router.push(PAGE_URL_RESET_PASSWORD)
}

let message = ref<any>(null)
onMounted(() => {
  message.value =
    getCurrentInstance()?.appContext.config.globalProperties.$message
})

const login = () => {
  formRef.value.validate(
    (valid: undefined | Record<string, ValidatedError>) => {
      if (!valid) {
        userLogin(form.value.username, form.value.password)
          .then((res) => {
            if (res.status === 200) {
              message.value.success('登录成功')
            }
            const data = res.data
            localCache.setCache('accessToken', data.accessToken)
            localCache.setCache('refreshToken', data.refreshToken)
            localCache.setCache('userInfo', data.userInfo)
          })
          .catch((err) => {
            message.value.error(err.message || '登录失败')
          })
      }
    }
  )
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
      .arco-btn {
        width: 100%;
      }
    }
  }
}
</style>
@/services/user-service
