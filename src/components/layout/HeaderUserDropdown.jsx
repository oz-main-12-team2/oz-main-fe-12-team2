import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/headeruserdropdown.scss";
import { useNavigate } from "react-router-dom";
import { LuUserRound, LuShoppingCart, LuLogOut } from "react-icons/lu";

function HeaderUserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-user-dropdown" ref={dropdownRef}>
      <FaUserCircle
        className="header-user-icon"
        size={28}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-user-info">
            <FaUserCircle size={40} className="dropdown-user-avatar" />
            <div className="dropdown-user-text">
              <span className="dropdown-user-name">{user.name}님</span>
              <span className="dropdown-user-email">{user.email}</span>
            </div>
          </div>

          <div className="dropdown-actions">
            <div className="dropdown-item" onClick={() => navigate("/mypage")}>
              <LuUserRound className="dropdown-item-icon" />
              <span className="dropdown-item-text">마이페이지</span>
            </div>
            <div className="dropdown-item" onClick={() => navigate("/cart")}>
              <LuShoppingCart className="dropdown-item-icon" />
              <span className="dropdown-item-text">장바구니</span>
            </div>
            <div className="dropdown-item" onClick={onLogout}>
              <LuLogOut className="dropdown-item-icon" />
              <span className="dropdown-item-text">로그아웃</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderUserDropdown;
