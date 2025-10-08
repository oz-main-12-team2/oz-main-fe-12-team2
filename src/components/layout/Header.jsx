import "../../styles/header.scss";

import { LuShoppingCart } from "react-icons/lu";
import {
  FaSearch, //검색 임시 숨김
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
// import NavBar from "./NavBar"; //검색 임시 숨김
import { useEffect, useState } from "react";
import HeaderUserDropdown from "./HeaderUserDropdown";
import Button from "../common/Button";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useUserStore from "../../stores/userStore";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import { logout } from "../../api/user";
import { AiOutlineUser } from "react-icons/ai";
import useDebounce from "../../hooks/useDebounce";
import useCartStore from "../../stores/cartStore";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); //검색 임시 숨김
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const isLogin = !!user; // user가 있으면 로그인 상태

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(query);
  const debouncedSearch = useDebounce(searchValue, 500);

  const setCartItems = useCartStore((state) => state.setCartItems);
  const cartCount = useCartStore((state) => state.cartCount);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      const scrollY = window.scrollY;
      const fixPoint = 200;

      if (scrollY > fixPoint) {
        header.classList.add("fixed");
      } else {
        header.classList.remove("fixed");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 항상 searchValue를 url query와 동기화
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleLogout = async () => {
    try {
      const alert = await alertComfirm(
        "로그아웃",
        "정말 로그아웃 하시겠습니까?"
      );
      if (!alert.isConfirmed) return;
      setCartItems([]);
      clearUser();
      await logout();
      await alertSuccess("로그아웃 성공", "로그아웃이 완료되었습니다");
      navigate("/", { replace: true });
    } catch (e) {
      console.error("로그아웃 실패 : ", e);
    } finally {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    navigate(`/search?query=${encodeURIComponent(searchValue)}`);

    setIsMobileSearchOpen(false); // 모바일 검색창 닫기
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // 검색어 입력 멈춤 디바운스 처리
  useEffect(() => {
    const trimmed = debouncedSearch.trim();

    if (trimmed) {
      // 검색어가 있으면 검색 페이지로 이동
      navigate(`/search?query=${encodeURIComponent(trimmed)}`, {
        replace: location.pathname.startsWith("/search"),
      });
      setIsMobileSearchOpen(false); // 모바일 검색창 닫기
    } else {
      // 검색창이 비워졌고 현재 검색 페이지면 메인 이동
      if (location.pathname.startsWith("/search")) {
        navigate("/", { replace: true });
      }
      setIsMobileSearchOpen(false); // 모바일 검색창 닫기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <header className="header">
      <div className="header-wrap">
        <Link to="/" className="header-logo">
          <img src="/new-logo.svg" alt="로고" />
        </Link>

        {/* PC 검색 (기존 그대로, pc-only 클래스 추가) */}
        <div className="header-search-wrap pc-only">
          <FaSearch
            className="header-search-icon"
            onClick={handleSearch}
            aria-hidden="true"
          />
          <input
            type="text"
            className="header-search-input"
            placeholder="도서를 검색해보세요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 모바일 검색 (768px 이하에서만 노출) */}
        <div
          className={`mobile-search-wrap mobile-only ${
            isMobileSearchOpen ? "active" : ""
          }`}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsMobileSearchOpen(false);
          }}
        >
          <FaSearch
            className="mobile-search-icon"
            onClick={() => setIsMobileSearchOpen((s) => !s)}
          />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="도서를 검색해보세요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 우측 영역 */}
        <div className="header-right">
          {/* PC 아이콘 + 로그인 */}
          <div className="header-icon-wrap pc-only">
            <Link to="/cart" className="header-cart">
              <LuShoppingCart className="header-cart-icon" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount >= 10 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <div className="header-actions">
              {isLogin ? (
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
            <FaBars size={22} />
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
              {isLogin ? (
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
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/cart");
                    }}
                  />
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount >= 10 ? "9+" : cartCount}
                    </span>
                  )}
                </div>

                <AiOutlineUser
                  size={26}
                  className="mobile-action-icon"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/mypage");
                  }}
                />
              </div>

              {/* 로그인 상태에 따라 버튼 변경 */}
              {isLogin ? (
                <Button variant="primary" size="md" onClick={handleLogout}>
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
