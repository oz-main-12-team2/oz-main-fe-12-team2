import { useNavigate } from "react-router-dom";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import { AiFillHome } from "react-icons/ai";
import { IoPowerSharp } from "react-icons/io5";
import useUserStore from "../../stores/userStore";
import { logout } from "../../api/user";
import useCartStore from "../../stores/cartStore";

function AdminHeader() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const getUser = useUserStore((state) => state.getUser);

  const handleGoHome = () => {
    navigate("/"); // 사용자 메인페이지로 이동
  };

  const handleLogout = async () => {
    const alert = await alertComfirm("로그아웃", "정말 로그아웃 하시겠습니까?");
    if (!alert.isConfirmed) return;
    setCartItems([]);
    clearUser();
    await logout();
    await alertSuccess("로그아웃 성공", "로그아웃이 완료되었습니다");
    await getUser(); // 바로상태 동기화, 서버에서 쿠키 확인 후 상태 업데이트
    navigate("/admin", { replace: true });
  };

  return (
    <header className="admin-header">
      <h1>ADMINISTRATOR</h1>
      <div className="header-icons">
        <AiFillHome className="icon-btn" onClick={handleGoHome} />
        <IoPowerSharp className="icon-btn" onClick={handleLogout} />
      </div>
    </header>
  );
}

export default AdminHeader;
