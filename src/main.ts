import { createApp } from 'vue'
import App from './App.vue'

// css初始化
import 'normalize.css'
import './assets/css/index.less'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createPinia } from 'pinia'

import router from './router'

import CrmTable from '@/components/crm-table.vue'

const store = createPinia()

const app = createApp(App)

app.use(Antd)

app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('CrmTable', CrmTable)

app.use(router)
app.use(store)

app.mount('#app')
