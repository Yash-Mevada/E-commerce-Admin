import React from 'react'
import { useAppSelector } from '@/store'
import { useDashboardQuery } from '@/hooks/useDashboardQuery'
import { Icons } from '@/components/Icons'
import { Skeleton } from '@/components/ui/skeleton'

const Dashboard: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token)

  const { data: statsData, isLoading } = useDashboardQuery(token)

  const stats = [
    {
      title: 'Total Users',
      value: statsData?.userCount ?? 0,
      loading: isLoading,
      description: 'Registered user accounts',
      icon: Icons.Users,
      colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
      borderClass: 'border-blue-100/50 dark:border-blue-900/30',
    },
    {
      title: 'Total Products',
      value: statsData?.productCount ?? 0,
      loading: isLoading,
      description: 'Active items in store catalog',
      icon: Icons.Package,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
      borderClass: 'border-emerald-100/50 dark:border-emerald-900/30',
    },
    {
      title: 'Total Categories',
      value: statsData?.categoryCount ?? 0,
      loading: isLoading,
      description: 'Product groupings and filters',
      icon: Icons.Layers,
      colorClass: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20',
      borderClass: 'border-violet-100/50 dark:border-violet-900/30',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          A high-level summary of your store's users, products, and categories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950/50 dark:border-slate-800 hover:shadow-md transition-all duration-300 group ${stat.borderClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</span>
                <div className={`p-2.5 rounded-xl ${stat.colorClass} transition-transform duration-300 group-hover:scale-105`}>
                  <IconComponent className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                {stat.loading ? (
                  <Skeleton className="h-10 w-24 rounded-lg" />
                ) : (
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                    {stat.value.toLocaleString()}
                  </span>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
