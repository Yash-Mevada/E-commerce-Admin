import { Column } from "@/components/CustomTable"
import { CustomerRecord } from "@/types/customer"
import { Button } from '@/components/ui/button'
import { Icons } from "@/components/Icons"

interface CustomerColumnsProps {
  onEdit: (customer: CustomerRecord) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: CustomerColumnsProps): Column<CustomerRecord>[] => [
  {
    key: 'first_name',
    header: 'Name',
    sortable: true,
    sortKey: 'first_name',
    render: (customer) => {
      const initials = `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase() || 'C'
      return (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
            {initials}
          </div>
          <button
            onClick={() => onEdit(customer)}
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline bg-transparent border-none p-0 cursor-pointer text-left transition-colors text-sm"
          >
            {customer.first_name} {customer.last_name}
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
    render: (customer) => <span className="text-slate-500 dark:text-slate-400 font-medium">{customer.email}</span>,
  },
  {
    key: 'phone_number',
    header: 'Phone',
    render: (customer) => <span className="text-slate-500 dark:text-slate-400">{customer.phone_number || '—'}</span>,
  },
  {
    key: 'address',
    header: 'Address',
    render: (customer) => <span className="text-slate-500 dark:text-slate-400 max-w-xs truncate block">{customer.address || '—'}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    sortKey: 'status',
    render: (customer) => {
      const isActive = customer.status?.toLowerCase() === 'active'
      return (
        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
          }`}>
          <span className="capitalize">{customer.status || 'Active'}</span>
        </div>
      )
    },
  },
  {
    key: 'createdAt',
    header: 'Registered Date',
    sortable: true,
    sortKey: 'createdAt',
    render: (customer) => (
      <span className="text-slate-400 dark:text-slate-500 text-xs">
        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', {
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
    render: (customer) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          onClick={() => onEdit(customer)}
          variant="ghost"
          size="icon"
          className="size-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border-none cursor-pointer"
          title="Edit customer"
        >
          <Icons.Pen className="size-4" />
        </Button>
        <Button
          onClick={() => onDelete(customer.id)}
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 rounded-lg transition-colors border-none cursor-pointer"
          title="Delete customer"
        >
          <Icons.Trash className="size-4" />
        </Button>
      </div>
    ),
  },
]
