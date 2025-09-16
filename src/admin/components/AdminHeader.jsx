import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { alertComfirm } from "../../utils/alert";

function AdminHeader() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // 사용자 메인페이지로 이동
  };

  const handleLogout = async () => {
    const logout = await alertComfirm(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?"
    );
    if (!logout.isConfirmed) return;
    localStorage.removeItem("token");
    handleGoHome();
  };

  return (
    <header className="admin-header">
      <h1>ADMINISTRATOR</h1>
      <div className="button-wrap">
        <Button variant="secondary" size="md" onClick={handleGoHome}>
          홈으로
        </Button>
        <Button size="md" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
