import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Icons } from './Icons'
import { cn } from '@/lib/utils'

interface DateRange {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

interface CustomDatePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
  placeholder?: string
  className?: string
}

type PresetType = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom'

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<PresetType>('all')
  const [tempStart, setTempStart] = useState(value.startDate || '')
  const [tempEnd, setTempEnd] = useState(value.endDate || '')
  const [hoverDate, setHoverDate] = useState<string | null>(null)
  
  // Track left calendar month/year
  const [leftMonth, setLeftMonth] = useState(new Date().getMonth())
  const [leftYear, setLeftYear] = useState(new Date().getFullYear())

  // Right month/year is always left + 1 month
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear

  const containerRef = useRef<HTMLDivElement>(null)

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Sync state when value changes externally
  useEffect(() => {
    setTempStart(value.startDate || '')
    setTempEnd(value.endDate || '')

    if (!value.startDate && !value.endDate) {
      setActivePreset('all')
    } else {
      const today = new Date()
      const todayStr = formatLocalDate(today)

      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      const yesterdayStr = formatLocalDate(yesterday)

      const start7 = new Date()
      start7.setDate(today.getDate() - 6)
      const start7Str = formatLocalDate(start7)

      const start30 = new Date()
      start30.setDate(today.getDate() - 29)
      const start30Str = formatLocalDate(start30)

      const startThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startThisMonthStr = formatLocalDate(startThisMonth)

      const startLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const startLastMonthStr = formatLocalDate(startLastMonth)
      const endLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      const endLastMonthStr = formatLocalDate(endLastMonth)

      if (value.startDate === todayStr && value.endDate === todayStr) {
        setActivePreset('today')
      } else if (value.startDate === yesterdayStr && value.endDate === yesterdayStr) {
        setActivePreset('yesterday')
      } else if (value.startDate === start7Str && value.endDate === todayStr) {
        setActivePreset('last7')
      } else if (value.startDate === start30Str && value.endDate === todayStr) {
        setActivePreset('last30')
      } else if (value.startDate === startThisMonthStr && value.endDate === todayStr) {
        setActivePreset('thisMonth')
      } else if (value.startDate === startLastMonthStr && value.endDate === endLastMonthStr) {
        setActivePreset('lastMonth')
      } else {
        setActivePreset('custom')
      }
    }
  }, [value])

  // Sync calendar views to match the selected start date when opened
  useEffect(() => {
    if (isOpen && value.startDate) {
      const startDateObj = new Date(value.startDate)
      setLeftMonth(startDateObj.getMonth())
      setLeftYear(startDateObj.getFullYear())
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigation handlers
  const handlePrevMonth = () => {
    if (leftMonth === 0) {
      setLeftMonth(11)
      setLeftYear(leftYear - 1)
    } else {
      setLeftMonth(leftMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (leftMonth === 11) {
      setLeftMonth(0)
      setLeftYear(leftYear + 1)
    } else {
      setLeftMonth(leftMonth + 1)
    }
  }

  // Format YYYY-MM-DD to display string
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-').map(Number)
    const d = new Date(year, month - 1, day)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  // Handle Preset Clicks
  const handlePresetSelect = (preset: PresetType) => {
    setActivePreset(preset)
    const today = new Date()
    const todayStr = formatLocalDate(today)

    if (preset === 'all') {
      onChange({ startDate: '', endDate: '' })
      setIsOpen(false)
    } else if (preset === 'today') {
      onChange({ startDate: todayStr, endDate: todayStr })
      setIsOpen(false)
    } else if (preset === 'yesterday') {
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      const yesterdayStr = formatLocalDate(yesterday)
      onChange({ startDate: yesterdayStr, endDate: yesterdayStr })
      setIsOpen(false)
    } else if (preset === 'last7') {
      const start = new Date()
      start.setDate(today.getDate() - 6)
      onChange({
        startDate: formatLocalDate(start),
        endDate: todayStr,
      })
      setIsOpen(false)
    } else if (preset === 'last30') {
      const start = new Date()
      start.setDate(today.getDate() - 29)
      onChange({
        startDate: formatLocalDate(start),
        endDate: todayStr,
      })
      setIsOpen(false)
    } else if (preset === 'thisMonth') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      onChange({
        startDate: formatLocalDate(start),
        endDate: todayStr,
      })
      setIsOpen(false)
    } else if (preset === 'lastMonth') {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      onChange({
        startDate: formatLocalDate(start),
        endDate: formatLocalDate(end),
      })
      setIsOpen(false)
    } else if (preset === 'custom') {
      // Just select preset mode, user interacts with calendar
    }
  }

  // Handle Date Cell Selection
  const handleDayClick = (day: number, month: number, year: number) => {
    setActivePreset('custom')
    const clickedStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(clickedStr)
      setTempEnd('')
    } else {
      if (new Date(clickedStr) < new Date(tempStart)) {
        setTempStart(clickedStr)
      } else {
        setTempEnd(clickedStr)
      }
    }
  }

  const handleApply = () => {
    onChange({ startDate: tempStart, endDate: tempEnd })
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActivePreset('all')
    onChange({ startDate: '', endDate: '' })
  }

  // Get current button label
  const getButtonLabel = () => {
    if (value.startDate && value.endDate) {
      if (value.startDate === value.endDate) {
        return formatDateLabel(value.startDate)
      }
      return `${formatDateLabel(value.startDate)} - ${formatDateLabel(value.endDate)}`
    } else if (value.startDate) {
      return `Since ${formatDateLabel(value.startDate)}`
    } else if (value.endDate) {
      return `Until ${formatDateLabel(value.endDate)}`
    }
    return 'All Time'
  }

  // Calendar calculations
  const getMonthDays = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDaysInMonth = new Date(year, month, 0).getDate()

    const days: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = []

    // Faded previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      days.push({
        day: prevDaysInMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      })
    }

    // Faded next month days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      days.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      })
    }

    return days
  }

  const leftMonthDays = useMemo(() => getMonthDays(leftYear, leftMonth), [leftYear, leftMonth])
  const rightMonthDays = useMemo(() => getMonthDays(rightYear, rightMonth), [rightYear, rightMonth])

  // Helpers to styles cells
  const getDayStyles = (day: number, month: number, year: number, isCurrentMonth: boolean) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isStart = tempStart === dateStr
    const isEnd = tempEnd === dateStr
    
    let inRange = false
    let inHoverRange = false

    if (tempStart && tempEnd) {
      inRange = dateStr > tempStart && dateStr < tempEnd
    } else if (tempStart && hoverDate) {
      inHoverRange = dateStr > tempStart && dateStr <= hoverDate
    }

    return {
      isStart,
      isEnd,
      inRange,
      inHoverRange,
      isFaded: !isCurrentMonth,
      dateStr
    }
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const renderMonthCalendar = (days: typeof leftMonthDays, month: number, year: number) => {
    return (
      <div className="w-56 shrink-0 select-none">
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {weekdays.map((wd) => (
            <div key={wd} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {wd}
            </div>
          ))}
          {days.map(({ day, month: cellMonth, year: cellYear, isCurrentMonth }, idx) => {
            const { isStart, isEnd, inRange, inHoverRange, isFaded, dateStr } = getDayStyles(day, cellMonth, cellYear, isCurrentMonth)
            
            return (
              <div
                key={idx}
                onMouseEnter={() => tempStart && !tempEnd && setHoverDate(dateStr)}
                onClick={() => handleDayClick(day, cellMonth, cellYear)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center text-[11px] font-medium cursor-pointer transition-colors relative",
                  isFaded ? "text-slate-300 dark:text-slate-700" : "text-slate-750 dark:text-slate-200",
                  
                  // Intermediate Range Backgrounds
                  inRange && "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
                  inHoverRange && "bg-slate-105/70 dark:bg-slate-800/40 text-slate-700",
                  
                  // Start and End selection shapes
                  isStart && "bg-blue-600 text-white font-bold rounded-l-full",
                  isEnd && "bg-blue-600 text-white font-bold rounded-r-full",
                  
                  // Single selected date
                  isStart && !tempEnd && "rounded-full",
                  isStart && tempEnd === tempStart && "rounded-full"
                )}
              >
                <span>{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Selector Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 flex items-center justify-between cursor-pointer transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 select-none",
          isOpen && "border-blue-500 ring-1 ring-blue-500/20"
        )}
      >
        <div className="flex items-center min-w-0">
          <Icons.Calendar className="size-4 text-slate-450 mr-2 shrink-0 pointer-events-none" />
          <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100">
            {getButtonLabel()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Icons.ChevronDown className={cn("size-3.5 text-slate-455 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </div>

      {/* Popover */}
      {isOpen && (
        <div className={cn(
          "absolute top-11 right-0 z-50 flex flex-col md:flex-row rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-150 dark:divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150",
          activePreset !== 'custom' ? "w-full" : "w-auto"
        )}>
          
          {/* Left Sidebar Presets */}
          <div className={cn(
            "flex flex-col py-2 bg-slate-50/50 dark:bg-slate-900/10 shrink-0",
            activePreset !== 'custom' ? "w-full" : "w-full md:w-36"
          )}>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'last7', label: 'Last 7 Days' },
              { id: 'last30', label: 'Last 30 Days' },
              { id: 'thisMonth', label: 'This Month' },
              { id: 'lastMonth', label: 'Last Month' },
              { id: 'custom', label: 'Custom Range' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id as PresetType)}
                className={cn(
                  "px-4 py-2.5 text-xs text-left font-semibold transition-colors cursor-pointer border-none bg-transparent whitespace-nowrap md:w-full",
                  activePreset === p.id 
                    ? "text-white bg-blue-600 font-bold" 
                    : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Right Calendar Grids Area */}
          {activePreset === 'custom' && (
            <div className="flex flex-col p-4 shrink-0 bg-white dark:bg-slate-950">
            {/* Header navigators */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 bg-transparent text-slate-500 cursor-pointer transition-colors"
              >
                <Icons.ChevronLeft className="size-4" />
              </button>
              
              <div className="flex-1 flex justify-around text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-56 text-center">{monthNames[leftMonth]} {leftYear}</span>
                <span className="w-56 text-center hidden md:inline-block">{monthNames[rightMonth]} {rightYear}</span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 bg-transparent text-slate-500 cursor-pointer transition-colors"
              >
                <Icons.ChevronRight className="size-4" />
              </button>
            </div>

            {/* Calendars display */}
            <div className="flex gap-6">
              {renderMonthCalendar(leftMonthDays, leftMonth, leftYear)}
              <div className="hidden md:block">
                {renderMonthCalendar(rightMonthDays, rightMonth, rightYear)}
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 gap-3">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {tempStart ? (
                  <span>
                    Selected: <b className="text-slate-800 dark:text-slate-250">{formatDateLabel(tempStart)}</b>
                    {tempEnd && <> to <b className="text-slate-800 dark:text-slate-250">{formatDateLabel(tempEnd)}</b></>}
                  </span>
                ) : (
                  <span>Select start and end dates</span>
                )}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs border-none cursor-pointer transition-colors shadow-sm"
                  disabled={!tempStart || !tempEnd}
                >
                  Apply
                </button>
              </div>
            </div>

          </div>
          )}

        </div>
      )}
    </div>
  )
}
