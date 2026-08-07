import { Column } from "@/components/CustomTable"
import { CategoryRecord } from "@/types/category"
import { Button } from '@/components/ui/button'
import { Icons } from "@/components/Icons"

interface CategoryColumnsProps {
  onEdit: (category: CategoryRecord) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: CategoryColumnsProps): Column<CategoryRecord>[] => [
  {
    key: 'name',
    header: 'Category Name',
    sortable: true,
    sortKey: 'name',
    render: (category) => {
      const initials = (category.name?.[0] || 'C').toUpperCase()
      return (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
            {initials}
          </div>
          <button
            onClick={() => onEdit(category)}
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none p-0 cursor-pointer text-left transition-colors text-sm"
          >
            {category.name}
          </button>
        </div>
      )
    },
  },
  {
    key: 'description',
    header: 'Description',
    sortable: true,
    sortKey: 'description',
    render: (category) => (
      <span className="text-slate-500 dark:text-slate-400 font-medium line-clamp-1 max-w-[300px]">
        {category.description || '—'}
      </span>
    ),
  },
  {
    key: 'products_count',
    header: 'Products Count',
    render: (category) => {
      const count = category.products?.length || 0
      return (
        <span className="text-slate-500 dark:text-slate-400">
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      )
    },
  },
  {
    key: 'created_at',
    header: 'Created Date',
    sortable: true,
    sortKey: 'created_at',
    render: (category) => (
      <span className="text-slate-400 dark:text-slate-500 text-xs">
        {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', {
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
    render: (category) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          onClick={() => onEdit(category)}
          variant="ghost"
          size="icon"
          className="size-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none cursor-pointer"
          title="Edit category"
        >
          <Icons.Pen className="size-4" />
        </Button>
        <Button
          onClick={() => onDelete(category.id)}
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 rounded-lg transition-colors border-none cursor-pointer"
          title="Delete category"
        >
          <Icons.Trash className="size-4" />
        </Button>
      </div>
    ),
  },
]
