import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { userService, UserRecord } from '@/services/api'
import { useUsersQuery } from '@/hooks/useUsersQuery'
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  setKeyword,
  setPage,
  setLimit,
  setSort,
} from '@/store/userSlice'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/button'
import { CustomInput } from '@/components/CustomInput'
import { CustomTable, Column } from '@/components/CustomTable'
import { AddUserModal } from './components/AddUserModal'
import { EditUserModal } from './components/EditUserModal'
import { CustomDeleteModal } from '@/components/CustomDeleteModal'

const Users: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  const {
    users,
    totalCount,
    isLoading,
    isDeleting,
    error,
    pagination,
    filter,
    sort
  } = useAppSelector((state) => state.user)

  // Local state for search & modal visibility
  const [searchVal, setSearchVal] = useState(filter.keyword)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // React Query Fetch hook
  const { data, isLoading: queryLoading, isError, error: queryError, refetch } = useUsersQuery({
    token,
    pagination,
    filter,
    sort,
  })

  // Sync React Query data to Redux Store
  useEffect(() => {
    if (data) {
      dispatch(fetchUsersSuccess({ rows: data.rows, count: data.count }))
    }
  }, [data, dispatch])

  // Sync React Query error to Redux Store
  useEffect(() => {
    if (isError && queryError) {
      dispatch(fetchUsersFailure((queryError as Error).message || 'Failed to load users.'))
    }
  }, [isError, queryError, dispatch])

  // Sync React Query loading state
  useEffect(() => {
    if (queryLoading) {
      dispatch(fetchUsersStart())
    }
  }, [queryLoading, dispatch])

  // Debounce/handle search input

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
  const handleDeleteUser = async (id: string) => {
    if (!token) return
    try {
      dispatch(deleteUserStart())
      const success = await userService.deleteUser(token, id)
      if (success) {
        dispatch(deleteUserSuccess(id))
        setDeleteConfirmId(null)
        refetch() // Sync state with backend using React Query refetch
      } else {
        dispatch(deleteUserFailure('Failed to delete user.'))
      }
    } catch (err: any) {
      dispatch(deleteUserFailure(err?.message || 'An error occurred while deleting the user.'))
    }
  }

  // Total pages calculation
  const totalPages = Math.ceil(totalCount / pagination.limit)

  const columns: Column<UserRecord>[] = [
    {
      key: 'first_name',
      header: 'Name',
      sortable: true,
      sortKey: 'first_name',
      render: (user) => {
        const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U'
        return (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              {initials}
            </div>
            <button
              onClick={() => setEditingUser(user)}
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none p-0 cursor-pointer text-left transition-colors text-sm"
            >
              {user.first_name} {user.last_name}
            </button>
          </div>
        )
      },
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
      sortKey: 'email',
      render: (user) => <span className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</span>,
    },
    {
      key: 'phone_number',
      header: 'Phone',
      render: (user) => <span className="text-slate-500 dark:text-slate-400">{user.phone_number || '—'}</span>,
    },
    {
      key: 'role',
      header: 'System Role',
      sortable: true,
      sortKey: 'role',
      render: (user) => {
        const isAdmin = user.role?.toLowerCase() === 'admin'
        return (
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isAdmin
            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
            <Icons.Shield className="size-3" />
            <span className="capitalize">{user.role}</span>
          </div>
        )
      },
    },
    {
      key: 'created_at',
      header: 'Registered Date',
      sortable: true,
      sortKey: 'created_at',
      render: (user) => (
        <span className="text-slate-400 dark:text-slate-500 text-xs">
          {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (user) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            onClick={() => setEditingUser(user)}
            variant="ghost"
            size="icon"
            className="size-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none cursor-pointer"
            title="Edit user"
          >
            <Icons.Edit className="size-4" />
          </Button>
          <Button
            onClick={() => setDeleteConfirmId(user.id)}
            variant="ghost"
            size="icon"
            className="size-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none cursor-pointer"
            title="Delete user"
          >
            <Icons.Trash className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  const emptyState = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <Icons.User className="size-6" />
      </div>
      <h3 className="font-semibold text-slate-800">No users found</h3>
      <p className="text-xs text-slate-400 max-w-xs">
        Try refining your search keyword or clearing the filters to discover registered accounts.
      </p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View, search, and manage registered admin and customer users.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 flex items-center gap-2 border-none shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
          >
            <Icons.AddUser className="size-4" />
            Add User
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="size-10 rounded-xl bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Refresh list"
            disabled={isLoading}
          >
            <Icons.Spinner className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar (Separated from table container) */}
      <div className="flex items-center w-full">
        <div className="relative w-full">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <CustomInput
            type="text"
            placeholder="Search by name, email..."
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
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">

        {/* Error notification */}
        {error && (
          <div className="m-5 p-4 rounded-xl bg-red-50 border border-red-150 text-red-800 flex items-start gap-3">
            <Icons.Alert className="size-5 shrink-0 text-red-500 mt-0.5" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Custom Table Component */}
        <CustomTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          loadingRowsCount={pagination.limit}
          emptyState={emptyState}
          keyExtractor={(user) => user.id}
          sort={sort}
          onSort={handleSortClick}
        />

        {/* Footer / Pagination Controls */}
        {totalCount > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/10 dark:bg-slate-900/50">
            {/* Showing range & Limit selector */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>
                Showing {users.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
                {Math.min(pagination.page * pagination.limit, totalCount)} of {totalCount} users
              </span>
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                  className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                onClick={() => dispatch(setPage(pagination.page - 1))}
                disabled={pagination.page === 1 || isLoading}
                variant="outline"
                size="icon"
                className="size-8 rounded-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Icons.ChevronLeft className="size-4" />
              </Button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1
                  const isCurrent = pageNum === pagination.page

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => dispatch(setPage(pageNum))}
                      disabled={isLoading}
                      variant={isCurrent ? 'default' : 'outline'}
                      className={`size-8 p-0 text-xs rounded-lg transition-colors font-semibold ${isCurrent
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => dispatch(setPage(pagination.page + 1))}
                disabled={pagination.page === totalPages || isLoading}
                variant="outline"
                size="icon"
                className="size-8 rounded-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Icons.ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>



      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetch}
        token={token}
      />

      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={refetch}
        token={token}
        user={editingUser}
      />

      <CustomDeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDeleteUser(deleteConfirmId)}
        title="Delete User Account"
        description="Are you sure you want to permanently delete this user account? This action is irreversible and will revoke all access privileges."
        confirmText="Delete Account"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Users
