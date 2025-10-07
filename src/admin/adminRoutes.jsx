import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Products from "./pages/Products";
import Users from "./pages/Users";

const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />, // 관리자 로그인 페이지
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ), // 관리자 공통 레이아웃
    children: [
      { index: true, element: <Dashboard /> }, // /admin
      { path: "products", element: <Products /> }, // /admin/products
      { path: "users", element: <Users /> }, // /admin/users
      { path: "orders", element: <Orders /> }, // /admin/orders
      { path: "payments", element: <Payments /> }, // /admin/orders
    ],
  },
];

export default adminRoutes;