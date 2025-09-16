import { Link, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuShoppingCart,
} from "react-icons/lu";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/admin");
  };

  return (
    <aside className="admin-sidebar">
      <div className="logo" onClick={handleGoHome}>
        LOV2LY
      </div>
      <nav>
        <Link to="/admin">
          <LuLayoutDashboard className="nav-icon" />
          <span>대시보드</span>
        </Link>
        <Link to="/admin/users">
          <LuUsers className="nav-icon" />
          <span>회원관리</span>
        </Link>
        <Link to="/admin/products">
          <LuBookOpen className="nav-icon" />
          <span>상품관리</span>
        </Link>
        <Link to="/admin/orders">
          <LuShoppingCart className="nav-icon" />
          <span>주문관리</span>
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
