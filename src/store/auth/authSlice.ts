import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  email: string
  name?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const tokenKey = 'shop_sphere_admin_token'
const userKey = 'shop_sphere_admin_user'

// Load initial state from localStorage if available
const savedToken = localStorage.getItem(tokenKey)
const savedUser = localStorage.getItem(userKey)

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isAuthenticated: !!savedToken,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null

      // Save to localStorage for persistence
      localStorage.setItem(tokenKey, action.payload.token)
      localStorage.setItem(userKey, JSON.stringify(action.payload.user))
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null

      localStorage.removeItem(tokenKey)
      localStorage.removeItem(userKey)
    },
    clearError(state) {
      state.error = null
    },
    updateProfile(state, action: PayloadAction<User>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem(userKey, JSON.stringify(state.user))
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateProfile } = authSlice.actions
export default authSlice.reducer
