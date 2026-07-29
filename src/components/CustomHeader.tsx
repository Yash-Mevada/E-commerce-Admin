import React from 'react'
import { Button } from "@/components/ui/button";
import { Icons } from './Icons';


interface CustomHeaderProps {
  title: string
  subtitle: string
  handleOpen: () => void
  refetch: () => void
  isLoading: boolean
  buttonName: string
}

const CustomHeader = ({ title, subtitle, handleOpen, refetch, isLoading, buttonName }: CustomHeaderProps) => {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col text-left">
        {title && <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>



      <div className="flex items-center gap-2">
        {buttonName && <Button
          onClick={handleOpen}
          className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 flex items-center gap-2 border-none shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Icons.AddUser className="size-4" />
          {buttonName}
        </Button>}
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
  )
}

export default CustomHeader