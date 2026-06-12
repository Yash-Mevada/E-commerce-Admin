import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white border border-slate-150 p-6 shadow-xl gap-4 dark:bg-slate-950 dark:border-slate-800">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight dark:text-slate-100">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-slate-500 leading-normal dark:text-slate-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="pt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
