import { useQuery } from '@tanstack/react-query'
import { get } from '@/services/api'

export interface DashboardStats {
  userCount: number
  productCount: number
  categoryCount: number
}

export function useDashboardQuery(token: string | null) {
  return useQuery({
    queryKey: ['dashboard-stats', token],
    queryFn: async () => {
      if (!token) throw new Error('No token found')
      const result = await get('/dashboard', token)

      if (result.success) {
        return result.data as DashboardStats
      }
      throw new Error(result.message || 'Failed to fetch dashboard stats.')
    },
    enabled: !!token,
  })
}
