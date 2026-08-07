export interface QueryParams {
  token: string | null
  pagination: {
    page: number
    limit: number
  }
  filter: {
    search: string[]
    keyword: string
  }
  sort: Record<string, 'ASC' | 'DESC'>
  filterByCategory?: string
  filterByDate?: {
    startDate: string
    endDate: string
  }
}

export type GetUsersParams = QueryParams
