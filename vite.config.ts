import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //这个path用到了上面安装的@types/node
const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //这里进行配置别名
  resolve: {
    alias: {
      '@': path.resolve('./src'), // @代替src
      '#': path.resolve('./types') // #代替types
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 用于全局导入，以避免需要单独导入每个样式文件。
          // reference:  避免重复引用
          hack: `true; @import (reference) "${resolve(
            'src/assets/css/index.less'
          )}";`
        },
        javascriptEnabled: true
      }
    }
  }
})
