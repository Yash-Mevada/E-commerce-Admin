import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserRecord } from '@/services/api'

interface UserState {
  users: UserRecord[]
  totalCount: number
  isLoading: boolean
  isDeleting: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
  }
  filter: {
    keyword: string
    search: string[]
  }
  sort: Record<string, 'ASC' | 'DESC'>
}

const initialState: UserState = {
  users: [],
  totalCount: 0,
  isLoading: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
  },
  filter: {
    keyword: '',
    search: ['first_name', 'last_name', 'email'],
  },
  sort: {
    created_at: 'DESC',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUsersStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchUsersSuccess(state, action: PayloadAction<{ rows: UserRecord[]; count: number }>) {
      state.isLoading = false
      state.users = action.payload.rows
      state.totalCount = action.payload.count
      state.error = null
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    deleteUserStart(state) {
      state.isDeleting = true
      state.error = null
    },
    deleteUserSuccess(state, action: PayloadAction<string>) {
      state.isDeleting = false
      state.users = state.users.filter((user) => user.id !== action.payload)
      state.totalCount = Math.max(0, state.totalCount - 1)
      state.error = null
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.isDeleting = false
      state.error = action.payload
    },
    setKeyword(state, action: PayloadAction<string>) {
      state.filter.keyword = action.payload
      state.pagination.page = 1 // Reset to first page on search
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload
    },
    setLimit(state, action: PayloadAction<number>) {
      state.pagination.limit = action.payload
      state.pagination.page = 1
    },
    setSort(state, action: PayloadAction<Record<string, 'ASC' | 'DESC'>>) {
      state.sort = action.payload
    },
    resetFilters(state) {
      state.filter.keyword = ''
      state.pagination.page = 1
      state.sort = { created_at: 'DESC' }
    },
  },
})

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  setKeyword,
  setPage,
  setLimit,
  setSort,
  resetFilters,
} = userSlice.actions

export default userSlice.reducer
