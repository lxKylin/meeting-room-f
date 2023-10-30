export default interface ServerResponse {
  success: boolean
  data?: Record<string, any> | any
  message?: string
}
