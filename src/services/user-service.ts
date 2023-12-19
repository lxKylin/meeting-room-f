import request from '@/utils/request'
import ServerResponse from '@/types/server-response'
import type { Register, UpdatePassword } from '@/types/user.type'

import {
  DATA_URL_LOGIN,
  DATA_URL_ADMIN_LOGIN,
  DATA_URL_REGISTER,
  DATA_URL_REGISTER_CAPTCHA,
  DATA_URL_UPDATE_PASSWORD,
  DATA_URL_UPDATE_USER_INFO_CAPTCHA,
  DATA_URL_REFRESH_TOKEN,
  DATA_URL_GET_USER_INFO,
  DATA_URL_UPDATE_USER_INFO
} from '@/constant/data-url-constants'

/**
 * 登录
 * @param username
 * @param password
 * @returns
 */
export const login = (username: string, password: string, isAdmin = false) => {
  const url = isAdmin ? DATA_URL_ADMIN_LOGIN : DATA_URL_LOGIN
  // 表示请求的响应数据的类型是 any，而服务器的响应类型是 ServerResponse。
  return request.post<any, ServerResponse>(url, {
    username,
    password
  })
}

/**
 * 注册
 * @param registerInfo
 * @returns
 */
export const register = (registerInfo: Register) => {
  return request.post<any, ServerResponse>(DATA_URL_REGISTER, registerInfo)
}

/**
 * 注册验证码
 * @param email
 * @returns
 */
export const registerCaptcha = (email: string) => {
  return request.get<any, ServerResponse>(DATA_URL_REGISTER_CAPTCHA, {
    params: { address: email }
  })
}

/**
 * 修改密码
 * @param updatePasswordInfo
 * @returns
 */
export const updatePassword = (updatePasswordInfo: UpdatePassword) => {
  delete updatePasswordInfo.password2
  return request.post<any, ServerResponse>(
    DATA_URL_UPDATE_PASSWORD,
    updatePasswordInfo
  )
}

/**
 * 修改用户信息验证码
 * @returns
 */
export const updateUserInfoCaptcha = () => {
  return request.get<any, ServerResponse>(DATA_URL_UPDATE_USER_INFO_CAPTCHA)
}

/**
 * 刷新token
 * @param refreshToken
 * @returns
 */
export const refreshToken = (refreshToken: string) => {
  return request.get<any, ServerResponse>(DATA_URL_REFRESH_TOKEN, {
    params: { refreshToken }
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<any, ServerResponse>(DATA_URL_GET_USER_INFO)
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (userInfo: any) => {
  return request.post<any, ServerResponse>(DATA_URL_UPDATE_USER_INFO, userInfo)
}
