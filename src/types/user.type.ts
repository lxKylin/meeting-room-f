export interface Register {
  username: string
  nickName: string
  password: string
  password2?: string
  email: string
  captcha: string
}

export interface UpdatePassword {
  username: string
  email: string
  captcha: string
  password: string
  password2?: string
}
