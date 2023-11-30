<template>
  <div class="page-search">
    <!-- 高级封装组件 -->
    <lx-form v-bind="searchFormConfig" v-model="formData">
      <template #header>
        <h1>检索</h1>
      </template>
      <template #footer>
        <div class="handle-btns">
          <a-button @click="handleResetClick">
            <icon-refresh />
            <span class="ml10" style="vertical-align: middle">重置</span>
          </a-button>
          <a-button class="ml10" type="primary" @click="handleSearchClick">
            <icon-search />
            <span class="ml10" style="vertical-align: middle">搜索</span>
          </a-button>
        </div>
      </template>
    </lx-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import LxForm from '@/base-ui/form'

const props = defineProps({
  searchFormConfig: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['resetBtnClick', 'searchBtnClick'])

// 双向绑定的属性应该是由配置文件的field来决定的
// 1.优化一：formData中的属性应该动态决定
const formItems = props.searchFormConfig?.formItems ?? []
const formOriginData: any = {}
// item拿到的是一个个对象
for (const item of formItems) {
  formOriginData[item.field] = ''
}
// formData搜索框中的数据
const formData = ref(formOriginData)

// 2.优化二：重置按钮 发送事件到user，user再传到page-content进行网络请求
const handleResetClick = () => {
  // formData.value = formOriginData
  for (const key in formOriginData) {
    formData.value[`${key}`] = formOriginData[key]
  }
  emits('resetBtnClick')
}

// 3.优化三：搜索实现 发送事件到user，user再传到page-content进行网络请求
const handleSearchClick = () => {
  emits('searchBtnClick', formData.value)
}
</script>

<style lang="less" scoped>
.page-search {
  .handle-btns {
    text-align: right;
    padding: 0 30px 20px 0;
  }
}
</style>
