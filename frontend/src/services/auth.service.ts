import { httpClient } from './httpClient'
import type { LoginRequest, LoginResponse } from '@/types/api'
import type { User } from '@/types/auth'

const TOKEN_KEY = 'rmotos_access_token'
const USER_KEY = 'rmotos_user'

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  hasValidSession(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

export const authService = {
  async login(username: string, pin: string): Promise<User> {
    const loginResponse = await httpClient.post<LoginResponse>('/auth/login', { username, pin } as LoginRequest)

    const { access_token: accessToken } = loginResponse

    httpClient.setAccessToken(accessToken)
    authStorage.setToken(accessToken)

    const user = await httpClient.get<User>('/auth/me')
    authStorage.setUser(user)

    return user
  },

  async validateSession(): Promise<User | null> {
    if (!authStorage.hasValidSession()) {
      return null
    }

    try {
      const accessToken = authStorage.getToken()
      if (accessToken) {
        httpClient.setAccessToken(accessToken)
      }

      const user = await httpClient.get<User>('/auth/me')
      authStorage.setUser(user)
      return user
    } catch (error) {
      authStorage.clear()
      httpClient.setAccessToken(null)
      return null
    }
  },

  async logout(): Promise<void> {
    authStorage.clear()
    httpClient.setAccessToken(null)
  },
}
