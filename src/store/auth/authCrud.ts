import { AppDispatch } from '@/store'
import { post, get } from '@/services/api'
import { LoginResponse } from '@/types/auth'
import { loginStart, loginSuccess, loginFailure } from './authSlice'

/**
 * Authenticates the admin user by calling the backend API.
 */
export const login = async (email: string, password: string, dispatch: AppDispatch): Promise<LoginResponse> => {
  dispatch(loginStart())

  try {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required.')
    }

    const result = await post('/users/login', { email, password })

    if (result.success) {
      const userData = result.data
      const token = userData.access_token

      const responseData: LoginResponse = {
        user: {
          email: userData.email,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Apex Admin',
        },
        token: token,
      }

      dispatch(loginSuccess(responseData))
      return responseData
    } else {
      throw new Error(result.message || 'Invalid email or password.')
    }
  } catch (err: any) {
    const errorMessage = err?.message || 'An error occurred during authentication.'
    dispatch(loginFailure(errorMessage))
    throw new Error(errorMessage)
  }
}

/**
 * Fetches the user profile details from the backend.
 */
export const getProfile = async (token: string): Promise<any> => {
  try {
    const result = await get('/users/profile', token)

    if (result.success) {
      return result.data
    } else {
      throw new Error(result.message || 'Failed to fetch user profile.')
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Failed to fetch user profile.')
  }
}
