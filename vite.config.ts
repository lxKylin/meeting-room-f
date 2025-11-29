import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //这个path用到了上面安装的@types/node

import { sentryVitePlugin } from '@sentry/vite-plugin'

// 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const resolve = (dir: string) => path.join(__dirname, dir)

const fePort = 1118
const serverOrigin = 'http://localhost:1231'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_SENTRY_ORG, VITE_SENTRY_PROJECT, VITE_SENTRY_AUTH_TOKEN } = env
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),

      sentryVitePlugin({
        org: VITE_SENTRY_ORG,
        project: VITE_SENTRY_PROJECT,

        authToken: VITE_SENTRY_AUTH_TOKEN
        // release: process.env.npm_package_version,
        // include: './dist',
        // cleanArtifacts: true
      })
    ],
    //这里进行配置别名
    resolve: {
      alias: {
        '@': path.resolve('./src'), // @代替src
        '#': path.resolve('./types') // #代替types
      }
    },
    // 服务器设置
    server: {
      cors: true, // 默认启用并允许·任何源
      host: '0.0.0.0', // 指定服务器主机名
      port: fePort, // 指定服务端口号
      open: true, // 运行自动打开浏览器
      // https: false, // 关闭https
      strictPort: true, // 若3030端口被占用,直接结束项目
      proxy: {
        // 选项写法
        '^/api': {
          target: serverOrigin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router']
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
