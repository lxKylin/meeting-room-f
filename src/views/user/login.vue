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
        <el-form-item prop="code" label="验证码">
          <div class="flex">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <div>
              <img
                class="ml20"
                style="width: 100px; height: 40px"
                :src="codeUrl"
                alt=""
                @click="setCodeUrl"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="login__main__footer">
        <div class="login__main__footer--top">
          <span @click="toResetPwdPage">忘记密码</span>
          <span @click="toRegisterPage">注册</span>
        </div>
        <el-button
          type="primary"
          @click="doLogin"
          :disabled="loading"
          style="width: 100%"
        >
          {{ loading ? '登录中...' : '登录' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import md5 from 'md5'

import {
  PAGE_URL_REGISTER,
  PAGE_URL_RESET_PASSWORD,
  PAGE_URL_MEETING_ROOM,
  PAGE_URL_ADMIN_MEETING_ROOM_LIST
} from '@/constant/page-url-constants'
import { DATA_URL_CAPTCHA_SVG } from '@/constant/data-url-constants'
import { login } from '@/services/user-service'

import { saveProfile } from '@/utils/save-profile'
import { AESUtil } from '@/utils/aes-utils'

const router = useRouter()

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: '',
  code: ''
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
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
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

let loading = ref<boolean>(false)
// 登录逻辑
const doLogin = () => {
  formRef.value!.validate((valid) => {
    if (valid) {
      // 转换成json字符串
      const plaintText = JSON.stringify({
        username: form.value.username,
        password: md5(form.value.password),
        timestamp: new Date().getTime()
      })
      // 加密
      const aesPassword = AESUtil.encrypt(plaintText)

      login(form.value.username, aesPassword, form.value.code)
        .then(({ data }) => {
          loading.value = true
          message.value.success('登录成功')
          saveProfile(data)
          // localCache.setCache('accessToken', data.accessToken)
          // localCache.setCache('refreshToken', data.refreshToken)
          // localCache.setCache('userInfo', data.userInfo)

          // TODO
          setTimeout(() => {
            router.push(
              data.userInfo.isAdmin
                ? PAGE_URL_ADMIN_MEETING_ROOM_LIST
                : PAGE_URL_MEETING_ROOM
            )
          }, 1000)
        })
        .catch((err) => {
          setCodeUrl()
          message.value.error(err.msg || '登录失败')
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

let codeUrl = ref<any>('')
const setCodeUrl = () => {
  codeUrl.value = `${DATA_URL_CAPTCHA_SVG}?.=${Math.random()}`
}
onMounted(() => {
  setCodeUrl()
})
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
