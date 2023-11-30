<template>
  <div class="user-profile">
    <div class="user-profile__main">
      <h1 class="user-profile__main__title">会议室预定系统个人信息</h1>
      <a-form :model="form" :rules="rules" auto-label-width>
        <a-form-item field="nickName" label="昵称">
          <a-input
            v-model="form.nickName"
            placeholder="请输入昵称"
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
          <a-button class="ml20" type="primary" @click="handleSendCaptcha">
            发送验证码
          </a-button>
        </a-form-item>
      </a-form>
      <div class="user-profile__main__footer">
        <a-button type="primary" @click="handleUpdateUserInfo">修改</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  updateUserInfo,
  updateUserInfoCaptcha,
  getUserInfo
} from '@/services/user-service'

const form = ref({
  nickName: '',
  email: '',
  captcha: ''
})

const rules = {
  nickName: [
    {
      required: true,
      message: '请输入昵称'
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

onMounted(() => {
  getUserInfo().then((res) => {
    form.value.nickName = res.data.nickName
    form.value.email = res.data.email
  })
})

const handleUpdateUserInfo = () => {
  updateUserInfo(form.value)
    .then((res) => {
      Message.success(res.data || '修改成功')
    })
    .catch((err) => {
      Message.error(err.msg || '修改失败')
    })
}

const handleSendCaptcha = () => {
  updateUserInfoCaptcha()
    .then(() => {
      Message.success('验证码发送成功')
    })
    .catch((err) => {
      Message.error(err.msg || '验证码发送失败')
    })
}
</script>

<style lang="less" scoped>
.user-profile {
  display: flex;
  justify-content: center;
  align-items: center;
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
