import { createApp } from 'vue'
import App from './App.vue'

// css初始化
import 'normalize.css'
import './assets/css/index.less'

import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import { Icon } from '@arco-design/web-vue'

const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/font_180975_ue66sq60vyd.js'
})

import router from './router'
import store from './store'

const app = createApp(App)

app.use(ArcoVue)
app.use(ArcoVueIcon)

app.use(router)
app.use(store)

// app.component('PageSearch', PageSearch)
app.component('IconFont', IconFont)

app.mount('#app')
