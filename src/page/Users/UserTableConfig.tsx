import { Column } from "@/components/CustomTable"
import { UserRecord } from "@/types/user"
import { Button } from '@/components/ui/button'
import { Icons } from "@/components/Icons"

interface UserColumnsProps {
  onEdit: (user: UserRecord) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: UserColumnsProps): Column<UserRecord>[] => [
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
            onClick={() => onEdit(user)}
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
          onClick={() => onEdit(user)}
          variant="ghost"
          size="icon"
          className="size-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none cursor-pointer"
          title="Edit user"
        >
          <Icons.Pen className="size-4" />
        </Button>
        <Button
          onClick={() => onDelete(user.id)}
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 rounded-lg transition-colors border-none cursor-pointer"
          title="Delete user"
        >
          <Icons.Trash className="size-4" />
        </Button>
      </div>
    ),
  },
]