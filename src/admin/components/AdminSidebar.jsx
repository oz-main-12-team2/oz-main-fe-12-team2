import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuShoppingCart,
} from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi"; // 햄버거 아이콘
import { AiFillHome } from "react-icons/ai";
import { IoPowerSharp, IoClose } from "react-icons/io5";
import { alertComfirm } from "../../utils/alert";

function AdminSidebar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGoHome = () => {
    navigate("/admin");
    setMenuOpen(false);
  };

  const handleCloseMenu = () => setMenuOpen(false);

  const handleUserHome = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    const logout = await alertComfirm(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?"
    );
    if (!logout.isConfirmed) return;
    localStorage.removeItem("token");
    handleUserHome();
  };

  return (
    <>
      {/* 사이드바 pc전용 */}
      <aside className="admin-sidebar">
        <div className="logo" onClick={handleGoHome}>
          LOV2LY
        </div>

        {/* 모바일 햄버거 버튼 */}
        <GiHamburgerMenu
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
        />

        {/* pc 사이드바메뉴 */}
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

      {/* 모바일 사이드패널 */}
      {menuOpen && (
        <>
          <div className="sidebar-panel">
            <div className="panel-header">
              <span className="close-btn" onClick={handleCloseMenu}>
                <IoClose className="close-btn" onClick={handleCloseMenu} />
              </span>
            </div>

            <nav>
              <Link to="/admin" onClick={handleCloseMenu}>
                <LuLayoutDashboard className="nav-icon" />
                <span>대시보드</span>
              </Link>
              <Link to="/admin/users" onClick={handleCloseMenu}>
                <LuUsers className="nav-icon" />
                <span>회원관리</span>
              </Link>
              <Link to="/admin/products" onClick={handleCloseMenu}>
                <LuBookOpen className="nav-icon" />
                <span>상품관리</span>
              </Link>
              <Link to="/admin/orders" onClick={handleCloseMenu}>
                <LuShoppingCart className="nav-icon" />
                <span>주문관리</span>
              </Link>
            </nav>

            {/* 모바일 패널 아래 홈/로그아웃 버튼 */}
            <div className="panel-footer">
              <AiFillHome className="icon-btn" onClick={handleUserHome} />
              <IoPowerSharp className="icon-btn" onClick={handleLogout} />
            </div>
          </div>

          {/* 오버레이 */}
          <div className="panel-overlay" onClick={handleCloseMenu} />
        </>
      )}
    </>
  );
}

export default AdminSidebar;
