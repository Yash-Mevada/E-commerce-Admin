import axios from 'axios'
import { store } from '@/store'
import { logout } from '@/store/auth/authSlice'

const BASE_URL = 'http://localhost:3000/api'

// Create a single Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
})

apiClient.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout())
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Reusable GET request helper
 */
export const get = async <T = any>(endpoint: string, token?: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(endpoint, {
      headers: getHeaders(token),
    })
    return response.data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'GET request failed.'
    throw new Error(message)
  }
}

/**
 * Reusable POST request helper
 */
export const post = async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
  try {
    const response = await apiClient.post<T>(endpoint, body, {
      headers: getHeaders(token),
    })
    return response.data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'POST request failed.'
    throw new Error(message)
  }
}

/**
 * Reusable PUT request helper
 */
export const put = async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
  try {
    const response = await apiClient.put<T>(endpoint, body, {
      headers: getHeaders(token),
    })
    return response.data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'PUT request failed.'
    throw new Error(message)
  }
}

/**
 * Reusable DELETE request helper
 */
export const del = async <T = any>(endpoint: string, token?: string): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(endpoint, {
      headers: getHeaders(token),
    })
    return response.data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'DELETE request failed.'
    throw new Error(message)
  }
}

/**
 * Reusable File Upload helper (POST multipart/form-data)
 */
export const uploadFile = async <T = any>(endpoint: string, file: File, token?: string): Promise<T> => {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await apiClient.post<T>(endpoint, formData, {
      headers,
    })
    return response.data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'File upload failed.'
    throw new Error(message)
  }
}


