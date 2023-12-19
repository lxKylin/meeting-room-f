<template>
  <div class="user-profile">
    <div class="user-profile__main">
      <h1 class="user-profile__main__title">会议室预定系统个人信息</h1>
      <a-form :model="form" :rules="rules" auto-label-width>
        <a-form-item field="headPic" label="头像">
          <a-upload
            action="/api/upload/picture"
            draggable
            :file-list="file ? [file] : []"
            :show-file-list="false"
            name="picture"
            @change="onChange"
            @progress="onProgress"
            @success="onSuccess"
            @error="onError"
          >
            <template #upload-button>
              <div
                :class="`arco-upload-list-item${
                  file && file.status === 'error'
                    ? ' arco-upload-list-item-error'
                    : ''
                }`"
              >
                <div
                  v-if="file && file.url"
                  class="arco-upload-list-picture custom-upload-avatar"
                >
                  <img :src="file.url" alt="image" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress
                    v-if="file.status === 'uploading' && file.percent < 100"
                    :percent="file.percent"
                    type="circle"
                    size="mini"
                    :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)'
                    }"
                  />
                </div>
                <div v-else class="arco-upload-picture-card">
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
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
import { ref, onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FileItem } from '@arco-design/web-vue'
import {
  updateUserInfo,
  updateUserInfoCaptcha,
  getUserInfo
} from '@/services/user-service'

import { useStore } from '@/store'
const store = useStore()

const form = reactive({
  headPic: '',
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

const file = ref<any>({})
onMounted(() => {
  getUserInfo().then((res) => {
    const { headPic, nickName, email, id } = res.data
    form.headPic = headPic
    form.nickName = nickName
    form.email = email

    // 头像
    file.value.uid = id
    file.value.url = store.headPic
    file.value.name = headPic.split('/')[1]
  })
})

const handleUpdateUserInfo = () => {
  updateUserInfo(form)
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

const onChange = (_: any, currentFile: FileItem) => {
  file.value = {
    ...currentFile
  }
}
const onProgress = (currentFile: FileItem) => {
  file.value = currentFile
}

const onSuccess = (FileItem: FileItem) => {
  form.headPic = FileItem.response.data.path
  store.setHeadPic(form.headPic)
  Message.success('头像上传成功')
}
const onError = () => {
  form.headPic = store.headPic || ''
  Message.error('头像上传失败')
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
