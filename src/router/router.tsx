import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout/Layout.tsx'
import { useAppSelector } from '@/store'

// Pages
import Dashboard from '@/page/Dashboard/Dashboard'
import Products from '@/page/Products/Products'
import Orders from '@/page/Orders/Orders'
import Customers from '@/page/Customers/Customers'
import Users from '@/page/Users/Users'
import Settings from '@/page/Settings/Settings'
import Login from '@/page/Login/Login'
import Profile from '@/page/Profile/Profile'

// Protected Route wrapper component
interface RouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route wrapper (prevent authenticated users from reaching login page)
const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/products', element: <Products /> },
      { path: '/orders', element: <Orders /> },
      { path: '/customers', element: <Customers /> },
      { path: '/users', element: <Users /> },
      { path: '/settings', element: <Settings /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
])

export default router
