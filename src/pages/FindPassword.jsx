import "../styles/findpassword.scss";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/user";
import { alertSuccess, alertError } from "../utils/alert";

function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("이메일을 입력해주세요.");
    } else if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // 클라이언트 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("이메일을 입력해주세요.");
    if (!emailRegex.test(email)) return setError("올바른 이메일 형식을 입력해주세요.");

    try {
      setIsSending(true);
      await requestPasswordReset(email.trim());

      // 성공 안내
      await alertSuccess(
        "메일 발송 완료",
        "비밀번호 재설정 링크를 이메일로 보냈습니다. 메일함(스팸함 포함)을 확인해주세요."
      );

      // 입력 초기화(선택)
      setEmail("");
    } catch (e) {
      // 서버가 필드 에러를 내려준 경우 이메일 옆에 표시
      if (e.fieldErrors?.email) {
        const msg = Array.isArray(e.fieldErrors.email) ? e.fieldErrors.email[0] : String(e.fieldErrors.email);
        setError(msg);
      } else {
        await alertError("발송 실패", e.message || "메일 발송에 실패했습니다.");
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <div className="base-container">
        <Link to="/">
          <img
            className="find-password-logo"
            src="../../public/logo.svg"
            alt="러블리 로고"
          />
        </Link>

        <form className="find-password-container" onSubmit={handleSubmit}>
          <p className="find-password-title">비밀번호 찾기</p>
          <p className="find-password-desc">
            회원정보에 등록된 이메일을 입력해주세요
          </p>

          <FormGroup
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error}
          />
          <div className="find-password-submit">
            <Button variant="primary" size="lg" type="submit" disabled={isSending}>
              {isSending ? "전송 중..." : "비밀번호 변경 이메일 받기"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FindPasswordPage;
