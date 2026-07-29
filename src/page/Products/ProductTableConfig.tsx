import { Column } from "@/components/CustomTable"
import { ProductRecord } from "@/types/product"
import { Button } from '@/components/ui/button'
import { Icons } from "@/components/Icons"

interface ProductColumnsProps {
  onEdit: (product: ProductRecord) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: ProductColumnsProps): Column<ProductRecord>[] => [
  {
    key: 'name',
    header: 'Product Name',
    sortable: true,
    sortKey: 'name',
    render: (product) => {
      return (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="size-full object-cover" onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=Product'
              }} />
            ) : (
              <div className="text-slate-400 font-bold text-xs">P</div>
            )}
          </div>
          <button
            onClick={() => onEdit(product)}
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none p-0 cursor-pointer text-left transition-colors text-sm"
          >
            {product.name}
          </button>
        </div>
      )
    },
  },
  {
    key: 'category',
    header: 'Category',
    render: (product) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
        {product.Category?.name || 'Unassigned'}
      </span>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    sortKey: 'price',
    render: (product) => (
      <span className="font-semibold text-slate-700 dark:text-slate-300">
        ${Number(product.price).toFixed(2)}
      </span>
    ),
  },
  {
    key: 'stock',
    header: 'Stock',
    sortable: true,
    sortKey: 'stock',
    render: (product) => {
      const stock = product.stock
      const isLow = stock <= 5
      return (
        <span className={`font-semibold ${isLow ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {stock} {stock === 1 ? 'unit' : 'units'} {isLow && stock > 0 && '(Low Stock)'} {stock === 0 && '(Out of stock)'}
        </span>
      )
    },
  },
  {
    key: 'description',
    header: 'Description',
    sortable: true,
    sortKey: 'description',
    render: (product) => (
      <span className="text-slate-500 dark:text-slate-400 font-medium line-clamp-1 max-w-[250px]">
        {product.description || '—'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Created Date',
    sortable: true,
    sortKey: 'created_at',
    render: (product) => (
      <span className="text-slate-400 dark:text-slate-500 text-xs">
        {product.created_at ? new Date(product.created_at).toLocaleDateString('en-US', {
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
    render: (product) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          onClick={() => onEdit(product)}
          variant="ghost"
          size="icon"
          className="size-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none cursor-pointer"
          title="Edit product"
        >
          <Icons.Pen className="size-4" />
        </Button>
        <Button
          onClick={() => onDelete(product.id)}
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 rounded-lg transition-colors border-none cursor-pointer"
          title="Delete product"
        >
          <Icons.Trash className="size-4" />
        </Button>
      </div>
    ),
  },
]
