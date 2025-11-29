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
import type { Pinia } from 'pinia'

// import * as Sentry from '@sentry/vue'

import router from './router'

import CrmTable from '@/components/crm-table.vue'

import { initSentry } from './sentry'

// throw new Error('test Sentry')

const store: Pinia = createPinia()
const app = createApp(App)

console.log('111', import.meta.env)

initSentry(app, router)

// Sentry.init({
//   app,
//   dsn: import.meta.env.SENTRY_DSN,https://9028c2a252cd976e8b706e682188cd89@o4510440563605504.ingest.us.sentry.io/4510440565506053
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true
// })

app.use(Antd)

app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('CrmTable', CrmTable)

app.use(router)
app.use(store)

app.mount('#app')
