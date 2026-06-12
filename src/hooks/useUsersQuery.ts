import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/api'

interface GetUsersParams {
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

export function useUsersQuery({ token, pagination, filter, sort }: GetUsersParams) {
  return useQuery({
    queryKey: ['users', pagination.page, pagination.limit, filter.keyword, sort, token],
    queryFn: () => {
      if (!token) throw new Error('No token found')
      return userService.getAllUsers(token, {
        pagination,
        filter: {
          search: filter.search,
          keyword: filter.keyword,
        },
        sort,
      })
    },
    enabled: !!token,
  })
}
