import React, { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppSidebar from '@/page/AppSidebar/AppSidebar'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/Icons'

const Layout: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user } = useAppSelector((state) => state.auth)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  // Sync theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  const toggleDarkMode = () => {
    const nextTheme = !isDarkMode
    setIsDarkMode(nextTheme)
    if (nextTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const initials = user?.name
    ? user.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U'

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-h-screen bg-slate-50/30 dark:bg-slate-900 flex flex-col transition-colors duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-slate-950 dark:border-slate-800 w-full shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="dark:text-slate-200" />
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="size-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 border-none bg-transparent cursor-pointer transition-colors focus:outline-none"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-amber-500"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-slate-600 dark:text-slate-400"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>

              {/* Logged in User Profile Info with Dropdown Trigger */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 select-none p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-none cursor-pointer text-left bg-transparent focus:outline-none"
                  >
                    {/* Avatar Badge */}
                    <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm shadow-md shadow-blue-500/10">
                      {initials}
                    </div>

                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">
                        {user?.name || 'Administrator'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-none">
                        {user?.email || 'admin@shopsphere.com'}
                      </span>
                    </div>

                    <ChevronDown className="size-4 text-slate-400 dark:text-slate-500 hidden sm:block ml-0.5" />
                  </button>

                  {/* Dropdown Menu Panel */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-100">
                      <div className="px-3 py-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-1 leading-none">
                          {user?.name || 'Administrator'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1.5">{user?.email}</p>
                      </div>

                      <Separator className="my-1 bg-slate-100 dark:bg-slate-800" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          navigate('/profile')
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors text-left cursor-pointer border-none bg-transparent"
                      >
                        <User className="size-4 text-slate-400 dark:text-slate-500" />
                        <span>Profile Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left cursor-pointer border-none bg-transparent"
                      >
                        <LogOut className="size-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Page Content */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default Layout
