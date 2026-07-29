import React, { useEffect, useState, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { ProductRecord } from '@/types/product'
import { useProductsQuery } from '@/hooks/useProductsQuery'
import { useCategorysQuery } from '@/hooks/useCategorysQuery'
import {
  setKeyword,
  setPage,
  setLimit,
  setSort,
} from '@/store/product/productSlice'
import { Icons } from '@/components/Icons'
import { CustomInput } from '@/components/CustomInput'
import { CustomTable } from '@/components/CustomTable'
import { AddProductModal } from './components/AddProductModal'
import { EditProductModal } from './components/EditProductModal'
import { CustomDeleteModal } from '@/components/CustomDeleteModal'
import { getColumns } from './ProductTableConfig'
import { deleteProduct } from '@/store/product/productCrud'
import CustomHeader from '@/components/CustomHeader'

const Products: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  const {
    isDeleting,
    error: deleteError,
    pagination,
    filter,
    sort
  } = useAppSelector((state) => state.product)

  // Local state for search & modal visibility
  const [searchVal, setSearchVal] = useState(filter.keyword)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: setEditingProduct,
        onDelete: setDeleteConfirmId,
      }),
    [setEditingProduct, setDeleteConfirmId]
  )

  // React Query Fetch hooks
  const { data, isLoading, isError, error: queryError, refetch } = useProductsQuery({
    token,
    pagination,
    filter,
    sort,
  })

  // Fetch categories for Select inputs
  const { data: categoriesData } = useCategorysQuery({
    token,
    pagination: { page: 1, limit: 100 },
    filter: { keyword: '', search: ['name'] },
    sort: { name: 'ASC' }
  })
  const categoriesList = categoriesData?.rows || []

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
  const handleDeleteProduct = async (id: string) => {
    if (!token) return
    try {
      const success = await deleteProduct(dispatch, token, id)
      if (success) {
        setDeleteConfirmId(null)
        refetch() // Sync state with backend using React Query refetch
      }
    } catch (err: any) {
      // Error is handled inside productCrud.deleteProduct
    }
  }

  const products = data?.rows || []
  const totalCount = data?.count || 0
  const displayError = deleteError || (isError ? (queryError as Error).message || 'Failed to load products.' : null)

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomHeader
          title="Products"
          subtitle="View, search, and manage your product catalog."
          handleOpen={() => setIsAddModalOpen(true)}
          refetch={refetch}
          isLoading={isLoading}
          buttonName="Add Product"
        />
      </div>

      {/* Filter / Search Bar (Separated from table container) */}
      <div className="flex items-center w-full">
        <div className="relative w-full">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <CustomInput
            type="text"
            placeholder="Search products by name or description..."
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

      {/* Main card panel - Flat Aesthetic (No shadow-sm) */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col">

        {/* Error notification */}
        {displayError && (
          <div className="m-5 p-4 rounded-xl bg-red-50 border border-red-150 text-red-800 flex items-start gap-3">
            <Icons.Alert className="size-5 shrink-0 text-red-500 mt-0.5" />
            <div className="text-sm font-medium">{displayError}</div>
          </div>
        )}

        <CustomTable
          columns={columns}
          data={products}
          isLoading={isLoading}
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
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetch}
        token={token}
        categories={categoriesList}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={refetch}
        token={token}
        product={editingProduct}
        categories={categoriesList}
      />

      <CustomDeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDeleteProduct(deleteConfirmId)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action is irreversible."
        confirmText="Delete Product"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Products
