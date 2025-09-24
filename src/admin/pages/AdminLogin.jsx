import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.scss";
// import { login } from "../../api/user";
import Button from "../../components/common/Button";
import FormGroup from "../../components/common/FormGroup";
import { alertError, alertSuccess } from "../../utils/alert";
import useUserStore from "../../stores/userStore";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  // 임시로 관리자계정
  const adminData = {
    email: "front-admin@naver.com",
    password: "front-admin",
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      //   const res = await login(email, password); // api 호출

      //   // 로그인 성공 후 확인..
      //   if (res.data.is_admin) {
      //     navigate("/admin", { replace: true });
      //   } else {
      //   await alertError(
      //     "로그인 실패",
      //     "이메일 또는 비밀번호가 올바르지 않습니다."
      //   );
      //   }      
      if (email === adminData.email && password === adminData.password) {
        // 성공 시 관리자 로그인 통과
        setUser({ email: adminData.email, is_admin: true });
        await alertSuccess("로그인 성공", "관리자 계정으로 로그인되었습니다.");
        navigate("/admin", { replace: true });
      } else {
        await alertError(
          "로그인 실패",
          "이메일 또는 비밀번호가 올바르지 않습니다."
        );
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
