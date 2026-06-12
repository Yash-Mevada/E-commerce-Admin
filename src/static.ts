export interface SidebarItem {
  title: string
  url: string
  icon: string
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "Home",
  },
  {
    title: "Products",
    url: "/products",
    icon: "Package",
  },
  {
    title: "Orders",
    url: "/orders",
    icon: "ShoppingCart",
  },
  {
    title: "Customers",
    url: "/customers",
    icon: "Users",
  },
  {
    title: "Users",
    url: "/users",
    icon: "User",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "Settings",
  },
]
