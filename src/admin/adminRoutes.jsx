import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />, // 공통 레이아웃
  children: [
    { index: true, element: <Dashboard /> }, // /admin
    { path: "products", element: <Products /> },   // /admin/products
    { path: "users", element: <Users /> },   // /admin/users
  ],
};

export default adminRoutes;