<template>
  <div class="room-user">
    <crm-table
      ref="tableRef"
      :data-getter="getDataList"
      :columns="tableColumns"
    ></crm-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import TableColumn from '@/types/table-column.ts'
import ListParams from '@/types/list-params'

import { getUserList } from '@/services/user-service.ts'

import { formatUtcString } from '@/utils/date-format.ts'

const getDataList = (params: ListParams) => {
  return getUserList(params)
}

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      prop: 'username',
      label: '用户名',
      searchConfig: {
        type: 'input'
      }
    },
    {
      prop: 'headPic',
      label: '头像'
    },
    {
      prop: 'nickName',
      label: '昵称',
      searchConfig: {
        type: 'input'
      }
    },
    {
      prop: 'email',
      label: '邮箱',
      searchConfig: {
        type: 'input'
      }
    },
    {
      prop: 'createTime',
      label: '注册时间',
      sortable: true,
      render: (row) => formatUtcString(row.createTime),
      searchConfig: {
        type: 'daterange'
      }
    }
  ]
})
</script>

<style lang="less" scoped>
.room-list {
}
</style>
