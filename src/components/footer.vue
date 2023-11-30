<template>
  <div class="footer">
    <div class="copyright">Copyright © {{ years }} All rights reserved.</div>
    <div class="version">版本 {{ version }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const currentYear: number = new Date().getFullYear()
const years = `2023-${currentYear}`
const version = ref<string>('1.0.0')
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  height: 46px;
  line-height: 46px;
  padding: 0 21px;
  text-align: left;
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 12px;
  color: #303133;
  background: #fff;
  box-shadow: 2px 0 4px 0 rgba(208, 208, 208, 0.5);
  z-index: 100;
}
</style>
