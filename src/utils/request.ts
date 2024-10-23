import axios from 'axios'
import { ElMessage } from 'element-plus'
import localCache from '@/utils/cache'
import ServerResponse from '@/types/server-response'
import { refreshToken } from '@/services/user-service'

const request = axios.create()

// request interceptor
request.interceptors.request.use(
  (config) => {
    const accessToken = localCache.getCache('accessToken')
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let inRefreshing = false // 当前是否正在请求刷新token
let waiting: any[] = [] // 报401的接口 加入等待列表 刷新接口成功后统一请求

// response interceptor
request.interceptors.response.use(
  (response) => {
    if (response.status !== 200 && response.status !== 201) {
      return Promise.reject(response)
    } else {
      const data: any = response.data
      if (data.success) {
        return data
      } else {
        return Promise.reject(data)
      }
    }
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }
    const { data, config } = error.response
    if (inRefreshing) {
      // 刷新token正在请求，把其他的接口加入等待数组
      return new Promise((resolve) => {
        waiting.push({
          config,
          resolve
        })
      })
    }

    // 刷新token
    if (data.status === 401 && !config.url.startsWith('/user/refresh')) {
      inRefreshing = true
      const refresh_token: string = localCache.getCache('refreshToken')
      const res: ServerResponse = await refreshToken(refresh_token)

      if (res.status === 200) {
        localCache.setCache('accessToken', res.data.access_token || '')
        localCache.setCache('refreshToken', res.data.refresh_token || '')
        inRefreshing = false

        // 声明一个Set来存储等待的请求
        const requestSet = new Set()

        // 刷新token请求成功，等待数据的失败接口重新发起请求
        waiting.forEach(({ config }) => {
          // 将请求加入Set中，去重
          requestSet.add(request(config))
        })
        waiting = [] // 请求完之后清空等待请求的数组

        return Promise.all([...requestSet]) // 当前接口重新发起请求
      } else {
        inRefreshing = false
        ElMessage.error('登录过期，请重新登录')

        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)

        return Promise.reject(res.data)
      }
    } else {
      return Promise.reject(data)
    }
  }
)

export default request
