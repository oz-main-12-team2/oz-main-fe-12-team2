import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.scss";
import Button from "../../components/common/Button";
import FormGroup from "../../components/common/FormGroup";
import { alertError, alertSuccess } from "../../utils/alert";
import useUserStore from "../../stores/userStore";
import { getUserMe, login } from "../../api/user";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await login(email, password);
    
      if (res.success) {
        const checkAdmin = await getUserMe();

        if (checkAdmin.is_admin) {
          setUser(checkAdmin);
          await alertSuccess(
            "로그인 성공",
            "관리자 계정으로 로그인되었습니다."
          );
          navigate("/admin", { replace: true });
        } else {
          await alertError("접근 불가", "관리자 계정만 접근 가능합니다.");
        }
      }
    } catch (e) {
      await alertError("로그인 실패", e.message || "문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <img
          src="/logo.svg"
          alt="로고"
          className="admin-login-logo"
          onClick={() => navigate("/")}
        />

        <form onSubmit={handleSubmit} className="admin-login-form">
          <FormGroup
            label="이메일"
            type="text"
            value={email}
            placeholder="관리자 이메일"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormGroup
            label="비밀번호"
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isloading}
          >
            {isloading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
