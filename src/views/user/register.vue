<template>
  <div class="register">
    <div class="register__main">
      <h1 class="register__main__title">会议室预定系统</h1>
      <el-form
        ref="formRef"
        class="register__main__form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            allow-clear
          />
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="password2" label="确认密码">
          <el-input
            v-model="form.password2"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" allow-clear />
        </el-form-item>
        <el-form-item prop="captcha" label="验证码">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            allow-clear
          />
          <el-button
            v-if="!sms.disabled"
            class="ml20"
            type="primary"
            @click="sendCode"
          >
            发送验证码
          </el-button>
          <el-button v-else class="ml20" type="secondary" disabled>
            {{ sms.count }} 秒后重新发送
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register__main__footer">
        <div class="register__main__footer--top">
          <span @click="toLoginPage">已有账号？去登录</span>
        </div>
        <el-button type="primary" @click="userRegister">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'

import { PAGE_URL_LOGIN } from '@/constant/page-url-constants'

import { registerCaptcha, register } from '@/services/user-service'

import { Register } from '@/types/user.type'

// 使用全局的 message 组件
let message = ref<any>(null)
onMounted(() => {
  message.value =
    getCurrentInstance()?.appContext.config.globalProperties.$message
})

const formRef = ref<FormInstance>()
const form = ref<Register>({
  username: '',
  nickName: '',
  password: '',
  password2: '',
  email: '',
  captcha: ''
})
const validatorPassword = (_: any, value: any, callback: any) => {
  if (value !== form.value.password) {
    callback('两次密码不一致')
  } else {
    callback()
  }
}
const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  nickName: [
    {
      required: true,
      message: '请输入昵称',
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
  password2: [
    {
      required: true,
      validator: validatorPassword,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  email: [
    {
      type: 'email',
      required: true,
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
})

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
  formRef.value!.validateField('email', (err: any) => {
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
  formRef.value!.validate((valid: any) => {
    if (valid) {
      delete form.value.password2
      register(form.value)
        .then(() => {
          message.value.success('注册成功')
          setTimeout(() => {
            router.push(PAGE_URL_LOGIN)
          }, 1000)
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
  margin-top: -100px;
  &__main {
    width: 400px;
    margin: 0 auto;
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
