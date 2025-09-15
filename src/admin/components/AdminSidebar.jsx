import { Link, useNavigate } from "react-router-dom";
import { FiLayout, FiUsers, FiBox, FiShoppingCart } from "react-icons/fi";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <aside className="admin-sidebar">
      <div className="logo" onClick={handleGoHome}>
        LOV2LY
      </div>
      <nav>
        <Link to="/admin">
          <FiLayout className="nav-icon" />
          <span>대시보드</span>
        </Link>
        <Link to="/admin/users">
          <FiUsers className="nav-icon" />
          <span>회원관리</span>
        </Link>
        <Link to="/admin/products">
          <FiBox className="nav-icon" />
          <span>상품관리</span>
        </Link>
        <Link to="/admin/orders">
          <FiShoppingCart className="nav-icon" />
          <span>주문관리</span>
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;