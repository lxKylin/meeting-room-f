<template>
  <div class="reset-pwd">
    <div class="reset-pwd__main">
      <h1 class="reset-pwd__main__title">会议室预定系统</h1>
      <el-form
        ref="formRef"
        class="reset-pwd__main__form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
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
          <el-button class="ml20" type="primary">发送验证码</el-button>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
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
      </el-form>
      <div class="reset-pwd__main__footer">
        <el-button type="primary" @click="resetPwd">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

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
      message: '请输入验证码',
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
      trigger: 'blur'
    }
  ]
})

const router = useRouter()
const resetPwd = () => {
  formRef.value.trigger((valid: undefined | Record<string, any>) => {
    if (!valid) {
      updatePassword(form.value)
        .then(() => {
          ElMessage.success('密码修改成功')
          setTimeout(() => {
            router.push(PAGE_URL_LOGIN)
          }, 1000)
        })
        .catch((e) => {
          ElMessage.error(e.msg || '密码修改失败')
        })
    }
  })
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
