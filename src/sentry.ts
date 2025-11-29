import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export const initSentry = (app: App, router: Router) => {
  Sentry.init({
    app,
    // Sentry 项目的 DSN 地址（在项目创建页可以看到）
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,

    integrations: [
      Sentry.browserTracingIntegration({
        router // 配置 vue-router 实例，自动记录路由跳转耗时
      })
    ],

    // 当前环境（如 dev、test、prod）
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',

    // 版本号信息，用于错误定位时区分版本差异，使用统一注入的版本号
    release: import.meta.env.VITE_SENTRY_RELEASE,

    // 是否开启调试（开发阶段建议为 true，线上建议关闭）
    debug: true,

    // 性能监控采样率（建议开发阶段设为 1.0）
    tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
  })
}
