import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
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
    deleteUserStart(state) {
      state.isDeleting = true
      state.error = null
    },
    deleteUserSuccess(state) {
      state.isDeleting = false
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
