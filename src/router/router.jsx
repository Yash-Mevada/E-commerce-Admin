import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/layout/Layout";

// Pages
import Dashboard from "@/page/Dashboard/Dashboard";
import Products from "@/page/Products/Products";
import Orders from "@/page/Orders/Orders";
import Customers from "@/page/Users/Users";
import Settings from "@/page/Settings/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/products", element: <Products /> },
      { path: "/orders", element: <Orders /> },
      { path: "/customers", element: <Customers /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

export default router;
