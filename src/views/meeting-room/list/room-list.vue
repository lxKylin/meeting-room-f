<template>
  <div class="room-list">
    <page-search :search-form-config="searchFormConfig" />
  </div>
</template>

<script lang="ts" setup>
import PageSearch from '@/components/page-search.vue'
import { searchFormConfig } from './config/search.config'
</script>

<style lang="less" scoped>
.room-list {
}
</style>
