import { useQuery } from '@tanstack/react-query'
import { post } from '@/services/api'
import { GetUsersParams } from '@/types/query'

export function useCustomersQuery({ token, pagination, filter, sort }: GetUsersParams) {
  return useQuery({
    queryKey: ['customers', pagination.page, pagination.limit, filter.keyword, sort, token],
    queryFn: async () => {
      if (!token) throw new Error('No token found')
      const result = await post(
        '/customers/all',
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
        throw new Error(result.message || 'Failed to fetch customers.')
      }
    },
    enabled: !!token,
  })
}
