import React, { useEffect, useState, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { CategoryRecord } from '@/types/category'
import { useCategorysQuery } from '@/hooks/useCategorysQuery'
import {
  setKeyword,
  setPage,
  setLimit,
  setSort,
} from '@/store/category/categorySlice'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/CustomInput'
import { CustomTable } from '@/components/CustomTable'
import { AddCategoryModal } from './components/AddCategoryModal'
import { EditCategoryModal } from './components/EditCategoryModal'
import { CustomDeleteModal } from '@/components/CustomDeleteModal'
import { getColumns } from './CategoryTableConfig'
import { deleteCategory } from '@/store/category/categoryCrud'
import CustomHeader from '@/components/CustomHeader'

const Categories: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  const {
    isDeleting,
    error: deleteError,
    pagination,
    filter,
    sort
  } = useAppSelector((state) => state.category)

  // Local state for search & modal visibility
  const [searchVal, setSearchVal] = useState(filter.keyword)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: setEditingCategory,
        onDelete: setDeleteConfirmId,
      }),
    [setEditingCategory, setDeleteConfirmId]
  )

  // React Query Fetch hook
  const { data, isLoading, isError, error: queryError, refetch } = useCategorysQuery({
    token,
    pagination,
    filter,
    sort,
  })

  // Debounce/handle search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchVal !== filter.keyword) {
        dispatch(setKeyword(searchVal))
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchVal, filter.keyword, dispatch])

  // Handle Sort Click
  const handleSortClick = (columnName: string) => {
    const currentDirection = sort[columnName]
    let newDirection: 'ASC' | 'DESC' = 'ASC'

    if (currentDirection === 'ASC') {
      newDirection = 'DESC'
    }

    dispatch(setSort({ [columnName]: newDirection }))
  }

  // Handle Delete Confirmation
  const handleDeleteCategory = async (id: string) => {
    if (!token) return
    try {
      const success = await deleteCategory(dispatch, token, id)
      if (success) {
        setDeleteConfirmId(null)
        refetch() // Sync state with backend using React Query refetch
      }
    } catch (err: any) {
      // Error is handled inside categoryCrud.deleteCategory
    }
  }

  const categories = data?.rows || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / pagination.limit)
  const displayError = deleteError || (isError ? (queryError as Error).message || 'Failed to load categories.' : null)

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomHeader
          title="Categories"
          subtitle="View, search, and manage product categories."
          handleOpen={() => setIsAddModalOpen(true)}
          refetch={refetch}
          isLoading={isLoading}
          buttonName="Add Category"
        />
      </div>

      {/* Filter / Search Bar (Separated from table container) */}
      <div className="flex items-center w-full">
        <div className="relative w-full">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <CustomInput
            type="text"
            placeholder="Search categories by name..."
            value={searchVal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchVal(e.target.value)}
            className="pl-12 pr-10 h-12 w-full text-sm"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-0 cursor-pointer"
            >
              <Icons.Close className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main card panel */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col">

        {/* Error notification */}
        {displayError && (
          <div className="m-5 p-4 rounded-xl bg-red-50 border border-red-150 text-red-800 flex items-start gap-3">
            <Icons.Alert className="size-5 shrink-0 text-red-500 mt-0.5" />
            <div className="text-sm font-medium">{displayError}</div>
          </div>
        )}

        {/* Custom Table Component */}
        <CustomTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          loadingRowsCount={pagination.limit}
          keyExtractor={(category) => category.id}
          sort={sort}
          onSort={handleSortClick}
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            totalCount,
            onPageChange: (p) => dispatch(setPage(p)),
            onLimitChange: (l) => dispatch(setLimit(l)),
          }}
        />
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetch}
        token={token}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSuccess={refetch}
        token={token}
        category={editingCategory}
      />

      <CustomDeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDeleteCategory(deleteConfirmId)}
        title="Delete Category"
        description="Are you sure you want to permanently delete this category? All associated product relations might be affected. This action is irreversible."
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Categories