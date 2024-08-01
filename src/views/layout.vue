<template>
  <el-container>
    <el-aside width="200px">
      <AsideMenu />
    </el-aside>
    <el-container>
      <el-header style="background: #fff; padding: 0">
        <Header class="header" />
      </el-header>
      <el-main><router-view /></el-main>
      <el-footer style="text-align: center">
        <Footer class="footer" />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Header from '@/components/header.vue'
import AsideMenu from '@/components/aside-menu.vue'
import Footer from '@/components/footer.vue'
</script>

<style lang="less" scoped>
.el-container {
  min-height: 100%;
  .el-footer {
    height: 46px;
    padding: 0;
  }
}
</style>
