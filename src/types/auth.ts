export interface LoginResponse {
  user: {
    email: string
    name: string
  }
  token: string
}
