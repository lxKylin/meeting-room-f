import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import router from './router'
import store from './store'

const app = createApp(App)

app.use(ArcoVue)
app.use(ArcoVueIcon)

app.use(router)
app.use(store)

app.mount('#app')
