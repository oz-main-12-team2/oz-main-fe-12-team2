import { useState } from "react";
import Button from "../common/Button";
import FormGroup from "../common/FormGroup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { alertComfirm, alertError, alertSuccess } from "../../utils/alert";
import { updatePassword } from "../../api/user";

function PasswordEdit() {
  // 입력값
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // 토글(아이콘)
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 에러/상태
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    mismatch: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const clearFieldError = (key) => {
    if (errors[key] || errors.mismatch) {
      setErrors((prev) => ({ ...prev, [key]: "", mismatch: "" }));
    }
  };

  const onChangeOld = (e) => {
    setOldPassword(e.target.value);
    clearFieldError("oldPassword");
  };
  const onChangeNew = (e) => {
    const v = e.target.value;
    setNewPassword(v);
    clearFieldError("newPassword");
    if (confirmNewPassword && v !== confirmNewPassword) {
      setErrors((p) => ({
        ...p,
        mismatch: "새 비밀번호와 확인이 일치하지 않습니다.",
      }));
    } else {
      setErrors((p) => ({ ...p, mismatch: "" }));
    }
  };
  const onChangeConfirm = (e) => {
    const v = e.target.value;
    setConfirmNewPassword(v);
    clearFieldError("confirmNewPassword");
    if (newPassword && v !== newPassword) {
      setErrors((p) => ({
        ...p,
        mismatch: "새 비밀번호와 확인이 일치하지 않습니다.",
      }));
    } else {
      setErrors((p) => ({ ...p, mismatch: "" }));
    }
  };

  const validate = () => {
    const next = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      mismatch: "",
    };

    if (!oldPassword) {
      next.oldPassword = "기존 비밀번호를 입력해주세요.";
    }

    if (!newPassword) {
      next.newPassword = "새 비밀번호를 입력해주세요.";
    }

    if (!confirmNewPassword) {
      next.confirmNewPassword = "비밀번호 확인을 입력해주세요.";
    }

    if (oldPassword && newPassword && oldPassword === newPassword) {
      next.newPassword = "이전에 사용한 비밀번호와 동일합니다.";
    }

    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      next.mismatch = "새 비밀번호와 확인이 일치하지 않습니다.";
    }

    // (선택) 강도 제약 예시: 8자 이상 권장
    if (newPassword && newPassword.length < 8) {
      next.newPassword = "비밀번호는 8자 이상이어야 합니다.";
    }

    setErrors(next);
    
    return (
      !next.oldPassword &&
      !next.newPassword &&
      !next.confirmNewPassword &&
      !next.mismatch
    );
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    // ✅ 확인창 띄우기
    const result = await alertComfirm(
      "비밀번호 수정",
      "입력하신 내용으로 수정하시겠습니까?"
    );
    if (!result.isConfirmed) return;

    try {
      setIsSaving(true);
      await updatePassword(oldPassword, newPassword, confirmNewPassword);

      await alertSuccess(
        "비밀번호 변경 완료",
        "비밀번호가 성공적으로 변경되었습니다."
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        mismatch: "",
      });
    } catch (e) {
      // ✅ 서버에서 내려준 필드 에러 매핑 (DRF 스타일)
      if (e.fieldErrors && typeof e.fieldErrors === "object") {
        const fe = e.fieldErrors;
        const next = {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          mismatch: "",
        };

        // 서버 키 → 클라이언트 키 매핑
        if (fe.old_password)
          next.oldPassword = Array.isArray(fe.old_password)
            ? fe.old_password[0]
            : String(fe.old_password);
        if (fe.new_password)
          next.newPassword = Array.isArray(fe.new_password)
            ? fe.new_password[0]
            : String(fe.new_password);
        if (fe.confirm_new_password)
          next.confirmNewPassword = Array.isArray(fe.confirm_new_password)
            ? fe.confirm_new_password[0]
            : String(fe.confirm_new_password);

        // 비일치/공통 에러
        if (fe.non_field_errors)
          next.mismatch = Array.isArray(fe.non_field_errors)
            ? fe.non_field_errors[0]
            : String(fe.non_field_errors);
        if (
          !next.oldPassword &&
          !next.newPassword &&
          !next.confirmNewPassword &&
          !next.mismatch
        ) {
          // 키가 다를 수도 있으니 메시지 전체를 토스트로
          await alertError("비밀번호 변경 실패", e.message);
        }

        setErrors(next);
      } else {
        await alertError(
          "비밀번호 변경 실패",
          e.message || "비밀번호 변경에 실패했습니다."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    if (
      (oldPassword || newPassword || confirmNewPassword) &&
      !window.confirm("입력한 내용을 취소할까요?")
    ) {
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      mismatch: "",
    });
  };

  return (
    <form className="edit-password-form" onSubmit={onSubmit}>
      {/* 기존 비밀번호 */}
      <div className="old-password">
        <FormGroup
          type={showOld ? "text" : "password"}
          label="기존 비밀번호"
          value={oldPassword}
          onChange={onChangeOld}
          placeholder="현재 사용 중인 비밀번호"
        />

        {showOld ? (
          <FaRegEye
            className="old-password-eye-icon"
            role="button"
            aria-label="비밀번호 가리기"
            tabIndex={0}
            onClick={() => setShowOld(false)}
          />
        ) : (
          <FaRegEyeSlash
            className="old-password-eye-icon"
            role="button"
            aria-label="비밀번호 보기"
            tabIndex={0}
            onClick={() => setShowOld(true)}
          />
        )}
      </div>
      {errors.oldPassword && (
        <p className="field-error-message" role="alert">
          {errors.oldPassword}
        </p>
      )}

      {/* 새 비밀번호 */}
      <div className="edit-password">
        <FormGroup
          type={showNew ? "text" : "password"}
          label="새 비밀번호"
          value={newPassword}
          onChange={onChangeNew}
          placeholder="새 비밀번호"
        />

        {showNew ? (
          <FaRegEye
            className="edit-password-eye-icon"
            role="button"
            aria-label="비밀번호 가리기"
            tabIndex={0}
            onClick={() => setShowNew(false)}
          />
        ) : (
          <FaRegEyeSlash
            className="edit-password-eye-icon"
            role="button"
            aria-label="비밀번호 보기"
            tabIndex={0}
            onClick={() => setShowNew(true)}
          />
        )}
      </div>
      {errors.newPassword && (
        <p className="field-error-message" role="alert">
          {errors.newPassword}
        </p>
      )}

      {/* 새 비밀번호 확인 */}
      <div className="confirm-edit-password">
        <FormGroup
          type={showConfirm ? "text" : "password"}
          label="새 비밀번호 확인"
          value={confirmNewPassword}
          onChange={onChangeConfirm}
          placeholder="새 비밀번호 확인"
        />

        {showConfirm ? (
          <FaRegEye
            className="confirm-edit-password-eye-icon"
            role="button"
            aria-label="비밀번호 가리기"
            tabIndex={0}
            onClick={() => setShowConfirm(false)}
          />
        ) : (
          <FaRegEyeSlash
            className="confirm-edit-password-eye-icon"
            role="button"
            aria-label="비밀번호 보기"
            tabIndex={0}
            onClick={() => setShowConfirm(true)}
          />
        )}
      </div>
      {errors.confirmNewPassword && (
        <p className="field-error-message" role="alert">
          {errors.confirmNewPassword}
        </p>
      )}
      {errors.mismatch && (
        <p className="field-error-message" role="alert">
          {errors.mismatch}
        </p>
      )}

      {/* 제출/취소 */}
      <div className="edit-password-actions">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "저장 중..." : "수정하기"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          취소
        </Button>
      </div>
    </form>
  );
}

export default PasswordEdit;
