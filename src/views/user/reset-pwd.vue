<template>
  <div class="reset-pwd">
    <div class="reset-pwd__main">
      <h1 class="reset-pwd__main__title">会议室预定系统</h1>
      <a-form
        ref="formRef"
        class="reset-pwd__main__form"
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
        <a-form-item field="email" label="邮箱">
          <a-input
            v-model="form.email"
            placeholder="请输入邮箱"
            disabled
            allow-clear
          />
        </a-form-item>
        <a-form-item field="captcha" label="验证码">
          <a-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            allow-clear
          />
          <a-button class="ml20" type="primary">发送验证码</a-button>
        </a-form-item>
        <a-form-item field="password" label="新密码">
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
import type { ValidatedError } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'

import { PAGE_URL_LOGIN } from '@/constant/page-url-constants'

import { UpdatePassword } from '@/types/user.type'

import { updatePassword } from '@/services/user-service'

const formRef = ref()
const form = ref<UpdatePassword>({
  username: '',
  email: '',
  captcha: '',
  password: '',
  password2: ''
})

const rules = ref({
  username: [
    {
      required: true,
      message: '请输入验证码',
      validate: 'blur'
    }
  ],
  email: [
    {
      type: 'email',
      required: true,
      validate: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      validate: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      validate: 'blur'
    }
  ],
  password2: [
    {
      required: true,
      message: '请输入密码',
      validate: 'blur'
    },
    {
      validator: (value: string, cb: any) => {
        if (value !== form.value.password) {
          cb('两次密码不一致')
        } else {
          cb()
        }
      }
    }
  ]
})

const router = useRouter()
const resetPwd = () => {
  formRef.value.validate(
    (valid: undefined | Record<string, ValidatedError>) => {
      if (!valid) {
        updatePassword(form.value)
          .then(() => {
            Message.success('密码修改成功')
            setTimeout(() => {
              router.push(PAGE_URL_LOGIN)
            }, 1000)
          })
          .catch((e) => {
            Message.error(e.msg || '密码修改失败')
          })
      }
    }
  )
}
</script>

<style lang="less" scoped>
.reset-pwd {
  display: flex;
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
