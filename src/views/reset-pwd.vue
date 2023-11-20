<template>
  <div class="reset-pwd">
    <div class="reset-pwd__main">
      <h1 class="reset-pwd__main__title">会议室预定系统</h1>
      <a-form
        class="reset-pwd__main__form"
        :model="form"
        :rules="rules"
        auto-label-width
      >
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
        <a-form-item field="newPassword" label="新密码">
          <a-input-password
            v-model="form.newPassword"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="oldPassword" label="确认密码">
          <a-input-password
            v-model="form.oldPassword"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <div class="reset-pwd__main__footer">
        <a-button type="primary" @click="resetPwd">修改</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { PAGE_URL_LOGIN } from '@/constant/page-url-constane'

const form = ref({
  email: '',
  captcha: '',
  newPassword: '',
  oldPassword: ''
})

const rules = {
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
  ],
  newPassword: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  oldPassword: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
}

const router = useRouter()
const resetPwd = () => {
  router.push(PAGE_URL_LOGIN)
}
</script>

<style lang="less" scoped>
.reset-pwd {
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
