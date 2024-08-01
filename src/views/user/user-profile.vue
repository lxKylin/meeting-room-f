<template>
  <div class="user-profile">
    <div class="user-profile__main">
      <h1 class="user-profile__main__title">会议室预定系统个人信息</h1>
      <el-form :model="form" :rules="rules" auto-label-width>
        <el-form-item field="headPic" label="头像">
          <el-upload
            action="/api/upload/picture"
            drag
            :file-list="file ? [file] : []"
            :show-file-list="false"
            name="picture"
            @change="onChange"
            @progress="onProgress"
            @success="onSuccess"
            @error="onError"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or
              <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item field="nickName" label="昵称">
          <el-input
            v-model="form.nickName"
            placeholder="请输入昵称"
            allow-clear
          />
        </el-form-item>
        <el-form-item field="email" label="邮箱">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            disabled
            allow-clear
          />
        </el-form-item>
        <el-form-item field="captcha" label="验证码">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            allow-clear
          />
          <el-button class="ml20" type="primary" @click="handleSendCaptcha">
            发送验证码
          </el-button>
        </el-form-item>
      </el-form>
      <div class="user-profile__main__footer">
        <el-button type="primary" @click="handleUpdateUserInfo">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
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

const rules = ref({
  nickName: [
    {
      required: true,
      message: '请输入昵称',
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
      ElMessage.success(res.data || '修改成功')
    })
    .catch((err) => {
      ElMessage.error(err.msg || '修改失败')
    })
}

const handleSendCaptcha = () => {
  updateUserInfoCaptcha()
    .then(() => {
      ElMessage.success('验证码发送成功')
    })
    .catch((err) => {
      ElMessage.error(err.msg || '验证码发送失败')
    })
}

const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile
  }
}
const onProgress = (currentFile: any) => {
  file.value = currentFile
}

const onSuccess = (FileItem: any) => {
  form.headPic = FileItem.response.data.path
  store.setHeadPic(form.headPic)
  ElMessage.success('头像上传成功')
}
const onError = () => {
  form.headPic = store.headPic || ''
  ElMessage.error('头像上传失败')
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
