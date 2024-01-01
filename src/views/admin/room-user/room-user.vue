<template>
  <div class="room-user">
    <page-search :search-form-config="searchFormConfig" />
    <a-table :data="listData">
      <template #columns>
        <a-table-column title="用户名" data-index="username"></a-table-column>
        <a-table-column title="头像" data-index="headPic"></a-table-column>
        <a-table-column title="昵称" data-index="nickName"></a-table-column>
        <a-table-column title="邮箱" data-index="email"></a-table-column>
        <a-table-column title="注册时间" data-index="createTime">
          <template #cell="{ record }">
            {{ formatUtcString(record.createTime) }}
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button
              :status="record.isFrozen ? 'success' : 'danger'"
              size="small"
            >
              {{ record.isFrozen ? '解除' : '冻结' }}
            </a-button>
            <a-button status="danger" size="small" style="margin-left: 20px">
              删除
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import PageSearch from '@/components/page-search.vue'
import { searchFormConfig } from './config/search.config'

import { getUserList } from '@/services/user-service.ts'

import { formatUtcString } from '@/utils/date-format.ts'

const listData = reactive([])

getUserList().then((res) => {
  const { data } = toRefs(res)
  listData.push(...data.value.rows)
})
</script>

<style lang="less" scoped>
.room-list {
}
</style>
