import localCache from '@/utils/cache'

export interface Profile {
  accessToken?: string
  refreshToken?: string
  access_token?: string
  refresh_token?: string
  userInfo?: object
}

export const saveProfile = (data: Profile) => {
  data.accessToken &&
    localCache.setCache(
      'accessToken',
      data.accessToken || data.access_token || ''
    )
  data.refreshToken &&
    localCache.setCache(
      'refreshToken',
      data.refreshToken || data.refresh_token || ''
    )
  data.refreshToken && localCache.setCache('userInfo', data.userInfo)
}
