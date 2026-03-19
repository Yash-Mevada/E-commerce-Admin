import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppSidebar from '@/page/AppSidebar/AppSidebar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/settings': 'Settings',
}

const Layout = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center gap-4 p-4 border-b w-full">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default Layout
