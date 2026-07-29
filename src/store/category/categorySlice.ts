import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CategoryState {
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

const initialState: CategoryState = {
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
  },
  filter: {
    keyword: '',
    search: ['name'],
  },
  sort: {
    created_at: 'DESC',
  },
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    deleteCategoryStart(state) {
      state.isDeleting = true
      state.error = null
    },
    deleteCategorySuccess(state) {
      state.isDeleting = false
      state.error = null
    },
    deleteCategoryFailure(state, action: PayloadAction<string>) {
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
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  setKeyword,
  setPage,
  setLimit,
  setSort,
  resetFilters,
} = categorySlice.actions

export default categorySlice.reducer
