import React from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export interface Column<T> {
  key: string
  header: React.ReactNode
  sortable?: boolean
  sortKey?: string
  className?: string
  render?: (row: T, index: number) => React.ReactNode
}

interface CustomTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  loadingRowsCount?: number
  keyExtractor?: (row: T, index: number) => string | number
  sort?: Record<string, 'ASC' | 'DESC'>
  onSort?: (sortKey: string) => void

  // Optional pagination props to enable footer controls
  pagination?: {
    page: number
    limit: number
    totalCount: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
}

export function CustomTable<T>({
  columns,
  data,
  isLoading = false,
  loadingRowsCount = 5,
  keyExtractor,
  sort,
  onSort,
  pagination,
}: CustomTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.totalCount / pagination.limit) : 0

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800">
          <TableRow className="hover:bg-transparent">
            {columns?.map((col) => {
              const isSortable = col.sortable && col.sortKey && onSort
              const sortDirection = col.sortKey ? sort?.[col.sortKey] : undefined

              return (
                <TableHead
                  key={col.key}
                  className={`py-4 px-6 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs select-none ${col.className || ''}`}
                >
                  {isSortable ? (
                    <button
                      onClick={() => onSort!(col.sortKey!)}
                      className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 text-slate-500 dark:text-slate-400 transition-colors border-none bg-transparent p-0 cursor-pointer font-semibold"
                    >
                      {col.header}
                      {sortDirection === 'ASC' && <ArrowUp className="size-3.5 text-blue-500" />}
                      {sortDirection === 'DESC' && <ArrowDown className="size-3.5 text-blue-500" />}
                      {!sortDirection && <ArrowUpDown className="size-3.5 text-slate-300 dark:text-slate-600" />}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm text-slate-700 dark:text-slate-300">
          {isLoading ? (
            Array.from({ length: loadingRowsCount }).map((_, rIdx) => (
              <TableRow key={rIdx} className="animate-pulse">
                {columns?.map((col) => (
                  <TableCell key={col.key} className={`py-4 px-6 ${col.className || ''}`}>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns?.length} className="py-12 px-6 text-center">
                <div className="text-slate-400 dark:text-slate-500 text-xs py-4">No data available</div>
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row, rIdx) => {
              const rowKey = keyExtractor ? keyExtractor(row, rIdx) : (row as any).id || rIdx
              return (
                <TableRow key={rowKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors border-b border-slate-100 dark:border-slate-800">
                  {columns?.map((col) => {
                    const cellContent = col.render ? col.render(row, rIdx) : (row as any)[col.key]
                    return (
                      <TableCell key={col.key} className={`py-4 px-6 ${col.className || ''}`}>
                        {cellContent}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/10 dark:bg-slate-900/50">
          {/* Showing range & Limit selector */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>
              Showing {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} items
            </span>
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={pagination.limit}
                onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
                className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-855 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nav controls */}
          <div className="flex items-center gap-1 sm:ml-auto">
            <Button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              variant="outline"
              size="icon"
              className="size-8 rounded-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1
                const isCurrent = pageNum === pagination.page

                return (
                  <Button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    disabled={isLoading}
                    variant={isCurrent ? 'default' : 'outline'}
                    className={`size-8 p-0 text-xs rounded-lg transition-colors font-semibold ${isCurrent
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages || isLoading}
              variant="outline"
              size="icon"
              className="size-8 rounded-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
