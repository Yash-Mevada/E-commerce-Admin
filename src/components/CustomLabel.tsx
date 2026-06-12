import React from 'react'
import { cn } from '@/lib/utils'

interface CustomLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const CustomLabel: React.FC<CustomLabelProps> = ({
  children,
  required = false,
  className,
  ...props
}) => {
  return (
    <label
      className={cn(
        "text-xs font-semibold text-slate-600 dark:text-slate-200 select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 font-bold ml-0.5">*</span>
      )}
    </label>
  )
}
