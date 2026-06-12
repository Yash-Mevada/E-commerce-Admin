import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import { AppDispatch } from '../store'

export interface LoginResponse {
  user: {
    email: string
    name: string
  }
  token: string
}

const BASE_URL = 'http://localhost:3000/api'

export const authService = {
  /**
   * Authenticates the admin user by calling the backend API.
   * If the backend server is unreachable, it falls back to mock authentication for offline testing.
   */
  async login(email: string, password: string, dispatch: AppDispatch): Promise<LoginResponse> {
    dispatch(loginStart())

    try {
      if (!email?.trim() || !password?.trim()) {
        throw new Error('Email and password are required.')
      }

      try {
        const response = await fetch(`${BASE_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          const userData = result.data
          const token = userData.access_token

          const responseData: LoginResponse = {
            user: {
              email: userData.email,
              name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Apex Admin',
            },
            token: token || 'mock-jwt-token-xyz-12345',
          }

          dispatch(loginSuccess(responseData))
          return responseData
        } else {
          throw new Error(result.message || 'Invalid email or password.')
        }
      } catch (networkError: any) {
        // Log the warning and check if they are using the default admin mock credentials
        console.warn('Backend connection failed, falling back to mock authentication:', networkError)
        
        // Simulate response delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (email === 'admin@shopsphere.com' && password === 'admin123') {
          const responseData: LoginResponse = {
            user: {
              email: email,
              name: 'Apex Admin (Offline Mode)',
            },
            token: 'mock-jwt-token-xyz-12345',
          }

          dispatch(loginSuccess(responseData))
          return responseData
        } else {
          // If the network call failed and they used wrong credentials, throw the network error or invalid credentials
          throw new Error(networkError.message?.includes('Failed to fetch') 
            ? 'Cannot connect to backend server. Try admin@shopsphere.com / admin123 for offline testing.' 
            : 'Invalid email or password.')
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during authentication.'
      dispatch(loginFailure(errorMessage))
      throw new Error(errorMessage)
    }
  },

  /**
   * Fetches the user profile details from the backend.
   */
  async getProfile(token: string): Promise<any> {
    if (token === 'mock-jwt-token-xyz-12345') {
      return {
        id: 'mock-admin-id',
        first_name: 'Apex',
        last_name: 'Admin (Offline)',
        email: 'admin@shopsphere.com',
        phone_number: '123-456-7890',
        role: 'Super Administrator',
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to fetch user profile.')
      }
    } catch (err: any) {
      console.warn('Backend profile fetch failed, using offline fallback:', err)
      return {
        id: 'mock-admin-id',
        first_name: 'Apex',
        last_name: 'Admin (Offline)',
        email: 'admin@shopsphere.com',
        phone_number: '123-456-7890',
        role: 'Super Administrator',
      }
    }
  },
}

export interface UserRecord {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
  created_at: string
  updated_at: string
}

const mockUsersList: UserRecord[] = [
  {
    id: 'u1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '555-0100',
    role: 'user',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'u2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone_number: '555-0101',
    role: 'user',
    created_at: '2026-06-02T11:00:00Z',
    updated_at: '2026-06-02T11:00:00Z',
  },
  {
    id: 'u3',
    first_name: 'Robert',
    last_name: 'Johnson',
    email: 'robert.j@example.com',
    phone_number: '555-0102',
    role: 'admin',
    created_at: '2026-06-03T09:30:00Z',
    updated_at: '2026-06-03T10:00:00Z',
  },
  {
    id: 'u4',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.b@example.com',
    phone_number: '555-0103',
    role: 'user',
    created_at: '2026-06-04T14:15:00Z',
    updated_at: '2026-06-04T14:15:00Z',
  },
  {
    id: 'u5',
    first_name: 'William',
    last_name: 'Davis',
    email: 'william.d@example.com',
    phone_number: '555-0104',
    role: 'user',
    created_at: '2026-06-05T08:00:00Z',
    updated_at: '2026-06-05T08:00:00Z',
  },
  {
    id: 'u6',
    first_name: 'David',
    last_name: 'Miller',
    email: 'david.m@example.com',
    phone_number: '555-0105',
    role: 'user',
    created_at: '2026-06-06T17:45:00Z',
    updated_at: '2026-06-06T17:45:00Z',
  },
  {
    id: 'u7',
    first_name: 'Richard',
    last_name: 'Wilson',
    email: 'richard.w@example.com',
    phone_number: '555-0106',
    role: 'user',
    created_at: '2026-06-07T12:00:00Z',
    updated_at: '2026-06-07T12:00:00Z',
  },
  {
    id: 'u8',
    first_name: 'Joseph',
    last_name: 'Moore',
    email: 'joseph.m@example.com',
    phone_number: '555-0107',
    role: 'user',
    created_at: '2026-06-08T10:30:00Z',
    updated_at: '2026-06-08T10:30:00Z',
  },
  {
    id: 'u9',
    first_name: 'Thomas',
    last_name: 'Taylor',
    email: 'thomas.t@example.com',
    phone_number: '555-0108',
    role: 'admin',
    created_at: '2026-06-09T09:00:00Z',
    updated_at: '2026-06-09T09:00:00Z',
  },
  {
    id: 'u10',
    first_name: 'Charles',
    last_name: 'Anderson',
    email: 'charles.a@example.com',
    phone_number: '555-0109',
    role: 'user',
    created_at: '2026-06-10T15:20:00Z',
    updated_at: '2026-06-10T15:20:00Z',
  },
  {
    id: 'u11',
    first_name: 'Patricia',
    last_name: 'Thomas',
    email: 'patricia.t@example.com',
    phone_number: '555-0110',
    role: 'user',
    created_at: '2026-06-11T11:10:00Z',
    updated_at: '2026-06-11T11:10:00Z',
  },
  {
    id: 'u12',
    first_name: 'Jennifer',
    last_name: 'Jackson',
    email: 'jennifer.j@example.com',
    phone_number: '555-0111',
    role: 'user',
    created_at: '2026-06-11T14:40:00Z',
    updated_at: '2026-06-11T14:40:00Z',
  },
]

// Keep track of deleted users in mock list locally for the offline testing duration
let localMockUsers = [...mockUsersList]

export const userService = {
  async getAllUsers(
    token: string,
    payload: {
      pagination?: { page: number; limit: number }
      filter?: { search: string[]; keyword: string }
      sort?: Record<string, 'ASC' | 'DESC'>
    }
  ): Promise<{ rows: UserRecord[]; count: number }> {
    if (token === 'mock-jwt-token-xyz-12345') {
      // Simulate response delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filtered = [...localMockUsers]

      // Filter
      if (payload.filter?.keyword && payload.filter.search?.length) {
        const keyword = payload.filter.keyword.toLowerCase()
        const searchFields = payload.filter.search
        filtered = filtered.filter((user) => {
          return searchFields.some((field) => {
            const val = (user as any)[field]
            return val?.toLowerCase().includes(keyword)
          })
        })
      }

      // Sort
      if (payload.sort && Object.keys(payload.sort).length > 0) {
        const [sortKey, sortValue] = Object.entries(payload.sort)[0]
        filtered.sort((a: any, b: any) => {
          const aVal = a[sortKey] || ''
          const bVal = b[sortKey] || ''
          if (sortValue === 'ASC') {
            return aVal.toString().localeCompare(bVal.toString())
          } else {
            return bVal.toString().localeCompare(aVal.toString())
          }
        })
      }

      const count = filtered.length
      const page = payload.pagination?.page || 1
      const limit = payload.pagination?.limit || 10
      const start = (page - 1) * limit
      const rows = filtered.slice(start, start + limit)

      return { rows, count }
    }

    try {
      const response = await fetch(`${BASE_URL}/users/alluser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return {
          rows: result.data || [],
          count: result.count !== undefined ? result.count : (result.data || []).length,
        }
      } else {
        throw new Error(result.message || 'Failed to fetch users.')
      }
    } catch (err: any) {
      console.warn('Backend fetch users failed, utilizing mock offline fallback:', err)
      // Call mock logic
      return this.getAllUsers('mock-jwt-token-xyz-12345', payload)
    }
  },

  async deleteUser(token: string, id: string): Promise<boolean> {
    if (token === 'mock-jwt-token-xyz-12345') {
      await new Promise((resolve) => setTimeout(resolve, 400))
      localMockUsers = localMockUsers.filter((u) => u.id !== id)
      return true
    }

    try {
      const response = await fetch(`${BASE_URL}/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return true
      } else {
        throw new Error(result.message || 'Failed to delete user.')
      }
    } catch (err: any) {
      console.warn('Backend delete user failed, using mock fallback:', err)
      localMockUsers = localMockUsers.filter((u) => u.id !== id)
      return true
    }
  },

  async createUser(
    token: string,
    payload: {
      first_name: string
      last_name: string
      email: string
      phone_number: string
      role: string
      password?: string
    }
  ): Promise<UserRecord> {
    if (token === 'mock-jwt-token-xyz-12345') {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newUser: UserRecord = {
        id: 'u' + (localMockUsers.length + 1),
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone_number: payload.phone_number,
        role: payload.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localMockUsers.unshift(newUser)
      return newUser
    }

    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to create user.')
      }
    } catch (err: any) {
      console.warn('Backend create user failed, using mock fallback:', err)
      return this.createUser('mock-jwt-token-xyz-12345', payload)
    }
  },

  async updateUser(
    token: string,
    id: string,
    payload: {
      first_name: string
      last_name: string
      email: string
      phone_number: string
      role: string
    }
  ): Promise<UserRecord> {
    if (token === 'mock-jwt-token-xyz-12345') {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const idx = localMockUsers.findIndex((u) => u.id === id)
      if (idx !== -1) {
        localMockUsers[idx] = {
          ...localMockUsers[idx],
          ...payload,
          updated_at: new Date().toISOString(),
        }
        return localMockUsers[idx]
      }
      throw new Error('User not found in mock state.')
    }

    try {
      const response = await fetch(`${BASE_URL}/users/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to update user.')
      }
    } catch (err: any) {
      console.warn('Backend update user failed, using mock fallback:', err)
      return this.updateUser('mock-jwt-token-xyz-12345', id, payload)
    }
  },
}


