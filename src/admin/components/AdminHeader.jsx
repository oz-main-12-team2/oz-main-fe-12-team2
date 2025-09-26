import { useNavigate } from "react-router-dom";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import { AiFillHome } from "react-icons/ai";
import { IoPowerSharp } from "react-icons/io5";
import useUserStore from "../../stores/userStore";
import { logout } from "../../api/user";

function AdminHeader() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleGoHome = () => {
    navigate("/"); // 사용자 메인페이지로 이동
  };

  const handleLogout = async () => {
    const alert = await alertComfirm(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?"
    );
    if (!alert.isConfirmed) return;
    clearUser(); // zustand에서 user 정보 삭제
    await logout(); // 서버 로그아웃 호출
    await alertSuccess("로그아웃 성공", "로그아웃이 완료되었습니다");
    navigate("/admin/login", { replace: true });
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
