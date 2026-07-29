const BASE_URL = 'http://localhost:3000/api'

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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(token),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'GET request failed.')
  }
  return result
}

/**
 * Reusable POST request helper
 */
export const post = async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(body),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'POST request failed.')
  }
  return result
}

/**
 * Reusable PUT request helper
 */
export const put = async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(body),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'PUT request failed.')
  }
  return result
}

/**
 * Reusable DELETE request helper
 */
export const del = async <T = any>(endpoint: string, token?: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'DELETE request failed.')
  }
  return result
}

/**
 * Reusable File Upload helper (POST multipart/form-data)
 */
export const uploadFile = async <T = any>(endpoint: string, file: File, token?: string): Promise<T> => {
  const formData = new FormData()
  formData.append('image', file)

  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'File upload failed.')
  }
  return result
}
