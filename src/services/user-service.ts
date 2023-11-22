import request from '@/utils/request'
import ServerResponse from '@/types/server-response'
import { Register } from '@/types/user.type'

import {
  DATA_URL_LOGIN,
  DATA_URL_REGISTER,
  DATA_URL_REGISTER_CAPTCHA
} from '@/constant/data-url-constants'

export const userLogin = (username: string, password: string) => {
  // 表示请求的响应数据的类型是 any，而服务器的响应类型是 ServerResponse。
  return request.post<any, ServerResponse>(DATA_URL_LOGIN, {
    username,
    password
  })
}

export const register = (registerInfo: Register) => {
  return request.post<any, ServerResponse>(DATA_URL_REGISTER, registerInfo)
}

export const registerCaptcha = (email: string) => {
  return request.get<any, ServerResponse>(DATA_URL_REGISTER_CAPTCHA, {
    params: { address: email }
  })
}
