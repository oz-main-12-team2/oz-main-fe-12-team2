import { useNavigate } from "react-router-dom";
import { alertComfirm } from "../../utils/alert";
import { AiFillHome } from "react-icons/ai";
import { IoPowerSharp } from "react-icons/io5";
import useUserStore from "../../stores/userStore";

function AdminHeader() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleGoHome = () => {
    navigate("/"); // 사용자 메인페이지로 이동
  };

  const handleLogout = async () => {
    const logout = await alertComfirm(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?"
    );
    if (!logout.isConfirmed) return;
    clearUser(); //전역 상태 초기화
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
