import React from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  emptyState?: React.ReactNode
  keyExtractor?: (row: T, index: number) => string | number
  sort?: Record<string, 'ASC' | 'DESC'>
  onSort?: (sortKey: string) => void
}

export function CustomTable<T>({
  columns,
  data,
  isLoading = false,
  loadingRowsCount = 5,
  emptyState,
  keyExtractor,
  sort,
  onSort,
}: CustomTableProps<T>) {
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
                {emptyState || (
                  <div className="text-slate-400 dark:text-slate-500 text-xs py-4">No data available</div>
                )}
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
    </div>
  )
}
