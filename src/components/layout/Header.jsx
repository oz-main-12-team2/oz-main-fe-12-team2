import "../../styles/header.scss";

import { LuShoppingCart } from "react-icons/lu";
import {
  //   FaSearch, //검색 임시 숨김
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
} from "react-icons/fa";
// import NavBar from "./NavBar"; //검색 임시 숨김
import { useEffect, useState } from "react";
import HeaderUserDropdown from "./HeaderUserDropdown";
import Button from "../common/Button";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); //검색 임시 숨김
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(3); // 3개로 일단 가정

  useEffect(() => {
    const token = "fffffffff"; // 임시
    if (token) setIsLoggedIn(true);
  }, []);

  const user = {
    name: "테스트",
    email: "test@example.com",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setCartCount(0);
  };

  return (
    <header className="header">
      <div className="header-wrap">
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="로고" />
        </Link>

        {/* 모바일 검색 */}
        {/* <div
          className={`header-search-wrap ${isMobileSearchOpen ? "active" : ""}`}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsMobileSearchOpen(false);
          }}
        >
          <FaSearch
            className="header-search-icon"
            onClick={() => setIsMobileSearchOpen((s) => !s)}
            aria-hidden="true"
          />
          <input
            type="text"
            className="header-search-input"
            placeholder="도서 검색"
          />
        </div> */}
        {/* 우측 영역 */}
        <div className="header-right">
          {/* PC 아이콘 + 로그인 */}
          <div className="header-icon-wrap pc-only">
            <Link to="/mypage/cart" className="header-cart">
              <LuShoppingCart className="header-cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <div className="header-actions">
              {isLoggedIn ? (
                <HeaderUserDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to="/login" className="header-action-link">
                    로그인
                  </Link>
                  <Link to="/signup" className="header-action-link">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="mobile-only header-hamburger"
            onClick={() => {
              setIsMobileMenuOpen(true);
              //   setIsMobileSearchOpen(false);
            }}
          >
            <FaBars size={22} color={"#888"} />
          </button>
        </div>
      </div>

      {/* PC 네비 */}
      {/* <div className="pc-only">
        <NavBar />
      </div> */}

      {/* 모바일 사이드패널 */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <button
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mobile-menu-body">
              {/* 로그인 상태에 따른 상단 영역 */}
              {isLoggedIn ? (
                <div className="mobile-user-info">
                  <FaUserCircle size={40} />
                  <div>
                    <p className="mobile-user-name">{user.name}님</p>
                    <p className="mobile-user-email">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="mobile-user-info mobile-user-guest">
                  <FaUserCircle size={48} />
                  <p className="mobile-user-guest-text">로그인 해주세요</p>
                </div>
              )}

              {/* 장바구니 / 마이페이지 아이콘 */}
              <div className="mobile-actions">
                <div
                  className="mobile-action-item"
                  style={{ position: "relative" }}
                >
                  <LuShoppingCart
                    size={28}
                    className="mobile-action-icon"
                    onClick={() => navigate("/mypage/cart")}
                  />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </div>

                <FaHome
                  size={26}
                  className="mobile-action-icon"
                  onClick={() => navigate("/mypage")}
                />
              </div>

              {/* 로그인 상태에 따라 버튼 변경 */}
              {isLoggedIn ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  로그인
                </Button>
              )}
              {/* 메뉴 (세로형) */}
              {/* <NavBar /> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
