import { useQuery } from '@tanstack/react-query'
import { post } from '@/services/api'
import { UserRecord } from '@/types/user'
import { GetUsersParams } from '@/types/query'

export function useUsersQuery({ token, pagination, filter, sort }: GetUsersParams) {
  return useQuery({
    queryKey: ['users', pagination.page, pagination.limit, filter.keyword, sort, token],
    queryFn: async () => {
      if (!token) throw new Error('No token found')
      const result = await post(
        '/users/alluser',
        {
          pagination,
          filter: {
            search: filter.search,
            keyword: filter.keyword,
          },
          sort,
        },
        token
      )

      if (result.success) {
        return {
          rows: result.data || [],
          count: result.count !== undefined ? result.count : (result.data || []).length,
        }
      } else {
        throw new Error(result.message || 'Failed to fetch users.')
      }
    },
    enabled: !!token,
  })
}
