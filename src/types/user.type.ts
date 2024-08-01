interface base {
  username: string
  email: string
  captcha: string
  password: string
  password2?: string
}

export interface Register extends base {
  // username: string
  nickName: string
  // password: string
  // password2?: string
  // email: string
  // captcha: string
}

export interface UpdatePassword extends base {
  // username: string
  // email: string
  // captcha: string
  // password: string
  // password2?: string
}
