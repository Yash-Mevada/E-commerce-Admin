import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CustomerState {
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

const initialState: CustomerState = {
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
  },
  filter: {
    keyword: '',
    search: ['first_name', 'last_name', 'email', 'phone_number'],
  },
  sort: {
    createdAt: 'DESC',
  },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    deleteCustomerStart(state) {
      state.isDeleting = true
      state.error = null
    },
    deleteCustomerSuccess(state) {
      state.isDeleting = false
      state.error = null
    },
    deleteCustomerFailure(state, action: PayloadAction<string>) {
      state.isDeleting = false
      state.error = action.payload
    },
    setKeyword(state, action: PayloadAction<string>) {
      state.filter.keyword = action.payload
      state.pagination.page = 1
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
      state.sort = { createdAt: 'DESC' }
    },
  },
})

export const {
  deleteCustomerStart,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  setKeyword,
  setPage,
  setLimit,
  setSort,
  resetFilters,
} = customerSlice.actions

export default customerSlice.reducer
