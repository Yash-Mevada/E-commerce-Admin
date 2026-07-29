import { post } from "@/services/api";
import { GetUsersParams } from "@/types/query";
import { useQuery } from "@tanstack/react-query";

export function useProductsQuery({
  token, pagination, filter, sort
}: GetUsersParams) {
  return useQuery({
    queryKey: ['products', pagination.page, pagination.limit, filter.keyword, sort, token],
    queryFn: async () => {
      if (!token) throw new Error('No token found')

      const result = await post('/products/all', {
        pagination,
        filter: {
          search: filter.search,
          keyword: filter.keyword
        },
        sort
      },
        token
      )

      if (result.success) {
        return {
          rows: result.data || [],
          count: result.count !== undefined ? result.count : (result.data || []).length
        }
      }
      throw new Error(result.message || 'Failed to fetch products')
    },
    enabled: !!token
  })
}
