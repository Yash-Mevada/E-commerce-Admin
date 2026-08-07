import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductState {
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
  filterByCategory: string
  filterByDate: {
    startDate: string
    endDate: string
  }
}

const initialState: ProductState = {
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
  },
  filter: {
    keyword: '',
    search: ['name', 'description'],
  },
  sort: {
    created_at: 'DESC',
  },
  filterByCategory: '',
  filterByDate: {
    startDate: '',
    endDate: '',
  },
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    deleteProductStart(state) {
      state.isDeleting = true
      state.error = null
    },
    deleteProductSuccess(state) {
      state.isDeleting = false
      state.error = null
    },
    deleteProductFailure(state, action: PayloadAction<string>) {
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
    setFilterByCategory(state, action: PayloadAction<string>) {
      state.filterByCategory = action.payload
      state.pagination.page = 1 // Reset to first page on filter change
    },
    setStartDate(state, action: PayloadAction<string>) {
      state.filterByDate.startDate = action.payload
      state.pagination.page = 1
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.filterByDate.endDate = action.payload
      state.pagination.page = 1
    },
    resetFilters(state) {
      state.filter.keyword = ''
      state.pagination.page = 1
      state.sort = { created_at: 'DESC' }
      state.filterByCategory = ''
      state.filterByDate = {
        startDate: '',
        endDate: '',
      }
    },
  },
})

export const {
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  setKeyword,
  setPage,
  setLimit,
  setSort,
  setFilterByCategory,
  setStartDate,
  setEndDate,
  resetFilters,
} = productSlice.actions

export default productSlice.reducer
