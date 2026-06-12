import { useState, useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { sidebarItems } from '@/static'
import { Home, Package, ShoppingCart, Users, Settings, Gem, LogOut, User, Sun, Moon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '../../store'
import { logout } from '../../store/authSlice'
import LogoImg from '@/assets/logo.png'

// Icon mapping type-safe definition
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Home,
  Package: Package,
  ShoppingCart: ShoppingCart,
  Users: Users,
  User: User,
  Settings: Settings,
}

const AppSidebar: React.FC = () => {
  const dispatch = useAppDispatch()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  // Watch for html class changes (in case toggled from header or elsewhere)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
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

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/30">
      {/* Sidebar Header with Logo and Project Name */}
      <SidebarHeader className="border-b border-sidebar-border/30 py-5 px-4 flex flex-row items-center gap-3 select-none">
        <img src={LogoImg} alt="Velora Logo" className="size-9 rounded-xl object-cover bg-white p-0.5 shadow-md shadow-blue-500/10 shrink-0" />
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden overflow-hidden transition-all duration-200">
          <span className="font-bold text-sm tracking-tight text-white leading-none whitespace-nowrap">Velora</span>
          <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase leading-none whitespace-nowrap">Admin Panel</span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content / Navigation Items */}
      <SidebarContent className="py-3">
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {sidebarItems?.map((item) => {
                const Icon = iconMap[item.icon] || Home
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} className="w-full block">
                      {({ isActive }) => (
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "w-full transition-all duration-200 gap-3 px-3 py-5 rounded-lg",
                            isActive
                              ? "bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 rounded-l-none pl-2.5"
                              : "bg-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                          )}
                        >
                          <Icon className={cn("size-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-blue-400" : "text-sidebar-foreground/60")} />
                          <span className="group-data-[collapsible=icon]:hidden">{item?.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Dark Mode Toggle and Logout */}
      <SidebarFooter className="p-3 border-t border-sidebar-border/30 gap-1.5">
        <SidebarMenu className="gap-1.5">
          {/* Dark Mode Toggle Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleDarkMode}
              className="w-full bg-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent/40 gap-3 px-3 py-5 rounded-lg transition-colors cursor-pointer"
              tooltip={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="size-4 shrink-0 text-amber-400" />
              ) : (
                <Moon className="size-4 shrink-0 text-sidebar-foreground/60" />
              )}
              <span className="group-data-[collapsible=icon]:hidden">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full bg-transparent text-sidebar-foreground/75 hover:bg-red-500/10 hover:text-red-400 gap-3 px-3 py-5 rounded-lg transition-colors cursor-pointer"
              tooltip="Log Out"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
