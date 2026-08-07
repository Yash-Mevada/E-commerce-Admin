import React from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">{Math.min(pagination.page * pagination.limit, pagination.totalCount)}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pagination.totalCount}</span>
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
            {/* First Page */}
            <Button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1 || isLoading}
              variant="ghost"
              size="icon"
              className="size-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 cursor-pointer"
            >
              <ChevronsLeft className="size-4" />
            </Button>

            {/* Previous Page */}
            <Button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              variant="ghost"
              size="icon"
              className="size-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Page numbers with ellipsis */}
            <div className="flex items-center gap-1 px-1">
              {(() => {
                const pages: (number | string)[] = []
                const maxVisible = 5

                if (totalPages <= maxVisible) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  pages.push(1)

                  const start = Math.max(2, pagination.page - 1)
                  const end = Math.min(totalPages - 1, pagination.page + 1)

                  if (start > 2) {
                    pages.push('...')
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(i)
                  }

                  if (end < totalPages - 1) {
                    pages.push('...')
                  }

                  pages.push(totalPages)
                }

                return pages.map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400 font-medium select-none">
                        ...
                      </span>
                    )
                  }

                  const isCurrent = pageNum === pagination.page

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => pagination.onPageChange(pageNum as number)}
                      disabled={isLoading}
                      variant={isCurrent ? 'outline' : 'ghost'}
                      className={`size-8 p-0 text-xs rounded-lg transition-colors font-semibold cursor-pointer ${
                        isCurrent
                          ? 'border border-slate-200 bg-white text-slate-900 font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50'
                          : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  )
                })
              })()}
            </div>

            {/* Next Page */}
            <Button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages || isLoading}
              variant="ghost"
              size="icon"
              className="size-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </Button>

            {/* Last Page */}
            <Button
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page === totalPages || isLoading}
              variant="ghost"
              size="icon"
              className="size-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 cursor-pointer"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
