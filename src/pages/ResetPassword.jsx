import "../styles/resetpassword.scss";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../api/user";
import { alertSuccess, alertError } from "../utils/alert";

function ResetPasswordPage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const uid = search.get("uid") || "";
  const token = search.get("token") || "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    password2: "",
    mismatch: "",
  });

  const clearErr = (k) => {
    if (errors[k] || errors.mismatch) {
      setErrors((p) => ({ ...p, [k]: "", mismatch: "" }));
    }
  };

  const onChangePassword = (e) => {
    const v = e.target.value;
    setPassword(v);
    clearErr("password");
    if (password2 && v !== password2) {
      setErrors((p) => ({ ...p, mismatch: "비밀번호와 확인이 일치하지 않습니다." }));
    } else {
      setErrors((p) => ({ ...p, mismatch: "" }));
    }
  };

  const onChangePassword2 = (e) => {
    const v = e.target.value;
    setPassword2(v);
    clearErr("password2");
    if (password && v !== password) {
      setErrors((p) => ({ ...p, mismatch: "비밀번호와 확인이 일치하지 않습니다." }));
    } else {
      setErrors((p) => ({ ...p, mismatch: "" }));
    }
  };

  const validate = () => {
    const next = { password: "", password2: "", mismatch: "" };
    if (!password) next.password = "비밀번호를 입력해주세요.";
    if (!password2) next.password2 = "비밀번호 확인을 입력해주세요.";
    if (password && password.length < 8) next.password = "비밀번호는 8자 이상이어야 합니다.";
    if (password && password2 && password !== password2) next.mismatch = "비밀번호와 확인이 일치하지 않습니다.";
    setErrors(next);
    return !next.password && !next.password2 && !next.mismatch;
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!uid || !token) {
      await alertError("잘못된 링크", "유효하지 않은 비밀번호 재설정 링크입니다.");
      return;
    }
    if (!validate()) return;

    try {
      setIsSaving(true);
      await confirmPasswordReset({
        uid,
        token,
        new_password: password,
        new_password_confirm: password2,
      });

      await alertSuccess("재설정 완료", "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
      navigate("/login");
    } catch (e) {
      // 서버 필드 에러 매핑
      if (e.fieldErrors && typeof e.fieldErrors === "object") {
        const fe = e.fieldErrors;
        const next = { password: "", password2: "", mismatch: "" };
        if (fe.new_password) next.password = Array.isArray(fe.new_password) ? fe.new_password[0] : String(fe.new_password);
        if (fe.new_password_confirm) next.password2 = Array.isArray(fe.new_password_confirm) ? fe.new_password_confirm[0] : String(fe.new_password_confirm);
        if (fe.non_field_errors) next.mismatch = Array.isArray(fe.non_field_errors) ? fe.non_field_errors[0] : String(fe.non_field_errors);
        if (!next.password && !next.password2 && !next.mismatch) {
          await alertError("재설정 실패", e.message || "비밀번호 재설정에 실패했습니다.");
        }
        setErrors(next);
      } else {
        await alertError("재설정 실패", e.message || "비밀번호 재설정에 실패했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="base-container">
        <Link to="/">
          <img
            className="reset-password-logo"
            src="/new-logo.svg"
            alt="러블리 로고"
          />
        </Link>

        <form className="reset-password-continer" onSubmit={onSubmit}>
          <p className="reset-password-title">비밀번호 재설정</p>
          <p className="reset-password-desc">
            재설정할 비밀번호를 입력해주세요
          </p>

          <div className="password-input">
            <FormGroup
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 입력"
              value={password}
              onChange={onChangePassword}
              error={errors.password}
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

          <div className="confirm-password-input">
            <FormGroup
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={password2}
              onChange={onChangePassword2}
              error={errors.password2}
            />
            {showConfirmPassword ? (
              <FaRegEye
                className="confirm-login-eye-icon"
                role="button"
                aria-label="비밀번호 가리기"
                tabIndex={0}
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <FaRegEyeSlash
                className="confirm-login-eye-icon"
                role="button"
                aria-label="비밀번호 보기"
                tabIndex={0}
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          {errors.mismatch && (
            <p className="field-error-message" role="alert">{errors.mismatch}</p>
          )}

          <div className="confirm-reset-password">
            <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
              {isSaving ? "처리 중..." : "비밀번호 재설정"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ResetPasswordPage;
