import React from 'react'
import { CustomModal } from './CustomModal'
import { Icons } from './Icons'

interface CustomDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export const CustomDeleteModal: React.FC<CustomDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to permanently delete this item? This action is irreversible.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <div className="size-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
            <Icons.Trash className="size-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold cursor-pointer transition-colors bg-white dark:bg-slate-950"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer border-none shadow-md shadow-red-500/10 transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.Spinner className="size-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  )
}
