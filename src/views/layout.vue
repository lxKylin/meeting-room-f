<template>
  <div class="layout">
    <Header class="header" />
    <div class="main">
      <a-layout>
        <a-layout-sider collapsible breakpoint="xl">
          <AsideMenu />
          <template #trigger="{ collapsed }">
            <IconCaretRight v-if="collapsed"></IconCaretRight>
            <IconCaretLeft v-else></IconCaretLeft>
          </template>
        </a-layout-sider>
        <a-layout-content><router-view /></a-layout-content>
      </a-layout>
    </div>
    <Footer class="footer" />
  </div>
</template>

<script lang="ts" setup>
import Header from '@/components/header.vue'
import AsideMenu from '@/components/aside-menu.vue'
import Footer from '@/components/footer.vue'
</script>

<style lang="less" scoped>
.layout {
  flex: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  .header {
    flex: none;
    flex-shrink: 0;
  }
  .main {
    flex: 1;
    overflow: auto;
    .arco-layout {
      height: calc(100vh - 106px);
    }
    .arco-layout-content {
      padding: 20px;
    }
  }
  .footer {
    flex: none;
    flex-shrink: 0;
  }
}
</style>
