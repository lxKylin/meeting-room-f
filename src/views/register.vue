<template>
  <div class="register">
    <div class="register__main">
      <h1 class="register__main__title">会议室预定系统</h1>
      <a-form
        ref="formRef"
        class="register__main__form"
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
        <a-form-item field="nickName" label="昵称">
          <a-input
            v-model="form.nickName"
            placeholder="请输入昵称"
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
        <a-form-item field="password2" label="确认密码">
          <a-input-password
            v-model="form.password2"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input v-model="form.email" placeholder="请输入邮箱" allow-clear />
        </a-form-item>
        <a-form-item field="captcha" label="验证码">
          <a-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            allow-clear
          />
          <a-button
            v-if="!sms.disabled"
            class="ml20"
            type="primary"
            @click="sendCode"
          >
            发送验证码
          </a-button>
          <a-button v-else class="ml20" type="secondary" disabled>
            {{ sms.count }} 秒后重新发送
          </a-button>
        </a-form-item>
      </a-form>
      <div class="register__main__footer">
        <div class="register__main__footer--top">
          <span @click="toLoginPage">已有账号？去登录</span>
        </div>
        <a-button type="primary" @click="userRegister">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import { PAGE_URL_LOGIN } from '@/constant/page-url-constants'

import { registerCaptcha, register } from '@/services/user-service'

let message = ref<any>(null)
onMounted(() => {
  message.value =
    getCurrentInstance()?.appContext.config.globalProperties.$message
})

const formRef = ref()
const form = ref({
  username: '',
  nickName: '',
  password: '',
  password2: '',
  email: '',
  captcha: ''
})
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名'
    }
  ],
  nickName: [
    {
      required: true,
      message: '请输入昵称'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  password2: [
    {
      required: true,
      message: '请输入密码'
    },
    {
      validator: (value: any, cb: any) => {
        if (value !== form.value.password) {
          cb('两次密码不一致')
        } else {
          cb()
        }
      }
    }
  ],
  email: [
    {
      type: 'email',
      required: true
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码'
    }
  ]
}

const router = useRouter()
const toLoginPage = () => {
  router.push(PAGE_URL_LOGIN)
}

// 验证码计时器
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0
})
// 计时器处理器
const timerHandler = () => {
  sms.count = sms.total
  sms.disabled = true

  let timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.count--
    } else {
      sms.disabled = false
      clearInterval(timer)
    }
  }, 1000)
}
const sendCode = () => {
  // 发送验证码前效验邮箱
  formRef.value.validateField('email', (err: any) => {
    if (!err) {
      registerCaptcha(form.value.email)
        .then(() => {
          message.value.success('验证码发送成功')
          timerHandler()
        })
        .catch((err) => {
          message.value.error(err.message || '系统繁忙，请稍后再试')
        })
    }
  })
}

const userRegister = () => {
  formRef.value.validate((valid: any) => {
    if (!valid) {
      delete form.value.password2
      register(form.value)
        .then(() => {
          message.value.success('注册成功')
          router.push(PAGE_URL_LOGIN)
        })
        .catch((err) => {
          message.value.error(err.message || '系统繁忙，请稍后再试')
        })
    }
  })
}
</script>

<style lang="less" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &__main {
    width: 400px;
    margin: 0 auto;
    margin-top: 100px;
    &__title {
      text-align: center;
      margin-bottom: 50px;
    }
    &__footer {
      margin-left: 70px;
      &--top {
        display: flex;
        justify-content: flex-end;
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
