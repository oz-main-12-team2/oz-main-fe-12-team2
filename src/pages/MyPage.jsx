import "../styles/mypage.scss";
import { Outlet } from "react-router-dom";
import { MdOutlineMailOutline, MdOutlineHome } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserMe } from "../api/user";
import Loading from "../components/common/Loading";
import { formatDateShort } from "../utils/dateFormat";

function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getUserMe();
        setUser(data);
      } catch (e) {
        setError(e.message || "사용자 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="base-container">
        <div className="mypage-layout">
          <aside className="mypage-sidebar">
            <nav>
              <p className="mypage-title">마이페이지</p>

              {loading && <Loading loadingText="사용자 정보를 불러오는 중" size={40} />}
              {error && !loading && (
                <p className="field-error-message">{error}</p>
              )}

              {user && !loading && (
                <div className="profile">
                  <p className="mypage-greeting">{user.name}님 반갑습니다!</p>
                  <div className="mypage-info">
                    <div className="mypage-email">
                      <MdOutlineMailOutline />
                      <p>{user.email}</p>
                    </div>
                    <div className="mypage-address">
                      <MdOutlineHome />
                      <p>{user.address}</p>
                    </div>
                    <div className="mypage-register-date">
                      <FiUserPlus />
                      <p>{formatDateShort(user.created_at)} 가입</p>
                    </div>
                  </div>
                </div>
              )}

              <Link to="/mypage">
                <span>계정설정</span>
              </Link>
              <Link to="/cart">
                <span>장바구니</span>
              </Link>
              <Link to="/orderlog">
                <span>주문내역</span>
              </Link>
              <Link to="/payments">
                <span>결제내역</span>
              </Link>
            </nav>
          </aside>
          <div className="mypage-main">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPage;
