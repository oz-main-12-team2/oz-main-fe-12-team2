import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />, // 공통 레이아웃
  children: [
    { index: true, element: <Dashboard /> }, // /admin
    { path: "products", element: <Products /> },   // /admin/products
  ],
};

export default adminRoutes;