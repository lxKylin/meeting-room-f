<template>
  <div class="register">
    <div class="register__main">
      <h1 class="register__main__title">会议室预定系统</h1>
      <a-form
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
        <a-form-item field="password1" label="密码">
          <a-input-password
            v-model="form.password1"
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
          <a-button class="ml20" type="primary">发送验证码</a-button>
        </a-form-item>
      </a-form>
      <div class="register__main__footer">
        <div class="register__main__footer--top">
          <span @click="toLoginPage">已有账号？去登录</span>
        </div>
        <a-button type="primary">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { PAGE_URL_LOGIN } from '@/constant/page-url-constane'

const form = ref({
  username: '',
  nickName: '',
  password1: '',
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
  password1: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  password2: [
    {
      required: true,
      message: '请输入密码'
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
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 100%;
  &__main {
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
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
