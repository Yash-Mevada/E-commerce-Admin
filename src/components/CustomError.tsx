import React from 'react'
import { cn } from '@/lib/utils'

interface CustomErrorProps {
  error?: string
  touched?: boolean
  className?: string
}

export const CustomError: React.FC<CustomErrorProps> = ({
  error,
  touched,
  className,
}) => {
  if (!touched || !error) return null

  return (
    <span className={cn('text-[12px] text-red-500 font-normal', className)}>
      {error}
    </span>
  )
}
