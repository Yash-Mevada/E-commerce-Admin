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
}

export type GetUsersParams = QueryParams
