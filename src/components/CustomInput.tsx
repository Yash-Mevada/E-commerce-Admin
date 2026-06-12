import React from 'react'
import { cn } from '@/lib/utils'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add additional customized props if needed in the future
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
          className
        )}
        {...props}
      />
    )
  }
)

CustomInput.displayName = 'CustomInput'
