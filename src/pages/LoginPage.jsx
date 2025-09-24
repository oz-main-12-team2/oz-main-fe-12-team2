import "../styles/loginpage.scss";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import naverlogin from "../assets/btnG_complete_login.png";
import googlelogin from "../assets/web_neutral_sq_SI@4x.png";
import api from "../api/axios";
import useUserStore from "../stores/userStore";
import { alertError, alertSuccess } from "../utils/alert";
import { login } from "../api/user";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setLoading, setError } = useUserStore();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
    //   console.log(res);
      if (res.success === true) {
        // const a = api.get('/user/me/');
        // console.log(a);
        await alertSuccess("로그인 성공", '환영합니다');
        navigate("/");
        // const test = api.get("/user/me/");
        // console.log(test);
      }
      //   await getUser(); // 방금 로그인한 정보
      //   await alertSuccess("로그인 성공", `${res.data.name}님 환영합니다.`);
      //   navigate("/");
    } catch (e) {
      setError(e.response?.data.error || "로그인 실패");
      await alertError("로그인 실패", "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="base-container">
      <img className="login-logo" src="/logo.svg" alt="러블리 로고" />

      <form className="login-container" onSubmit={handleLogin}>
        <FormGroup
          type="email"
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-input">
          <FormGroup
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaRegEye
              className="login-eye-icon"
              role="button"
              aria-label="비밀번호 가리기"
              tabIndex={0}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEyeSlash
              className="login-eye-icon"
              role="button"
              aria-label="비밀번호 보기"
              tabIndex={0}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <div className="login-account-options">
          <div className="login-button">
            <Button variant="primary" size="lg" type="submit">
              로그인
            </Button>
          </div>
          <div className="account-options">
            <Link to="/find-password">비밀번호 찾기</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>

        <div className="social-login">
          <Link to="#" className="naver-login">
            <img src={naverlogin} alt="네이버로그인" />
          </Link>
          <Link to="#" className="google-login">
            <img src={googlelogin} alt="구글로그인" />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
