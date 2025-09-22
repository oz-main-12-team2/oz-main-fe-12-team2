import {useState } from "react";
import Button from "../common/Button";
import FormGroup from "../common/FormGroup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

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
            setErrors((p) => ({ ...p, mismatch: "새 비밀번호와 확인이 일치하지 않습니다." }));
        } else {
            setErrors((p) => ({ ...p, mismatch: "" }));
        }
    };
    const onChangeConfirm = (e) => {
        const v = e.target.value;
        setConfirmNewPassword(v);
        clearFieldError("confirmNewPassword");
        if (newPassword && v !== newPassword) {
            setErrors((p) => ({ ...p, mismatch: "새 비밀번호와 확인이 일치하지 않습니다." }));
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
        if (!oldPassword) next.oldPassword = "기존 비밀번호를 입력해주세요.";
        if (!newPassword) next.newPassword = "새 비밀번호를 입력해주세요.";
        if (!confirmNewPassword) next.confirmNewPassword = "비밀번호 확인을 입력해주세요.";
        if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
            next.mismatch = "새 비밀번호와 확인이 일치하지 않습니다.";
        }
        // (선택) 강도 제약 예시: 8자 이상 권장
        if (newPassword && newPassword.length < 8) {
            next.newPassword = "비밀번호는 8자 이상이어야 합니다.";
        }
        setErrors(next);
        return !next.oldPassword && !next.newPassword && !next.confirmNewPassword && !next.mismatch;
    };

    const onSubmit = async () => {
        if (!validate()) return;
        try {
            setIsSaving(true);
            // TODO: 실제 API로 교체
            // const res = await fetch("/api/users/password", {
            //   method: "PUT",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ oldPassword, newPassword }),
            // });
            // if (!res.ok) {
            //   const msg = await res.text();
            //   // 서버에서 '현재 비밀번호 불일치' 같은 메시지를 내려줄 경우 매핑
            //   throw new Error(msg || "비밀번호 변경에 실패했습니다.");
            // }

            await new Promise((r) => setTimeout(r, 500)); // 데모용
            // TODO: 토스트로 “비밀번호가 변경되었습니다.”
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setErrors({ oldPassword: "", newPassword: "", confirmNewPassword: "", mismatch: "" });
        } catch (e) {
            console.error(e);
            // 서버 에러 매핑 예시
            setErrors((p) => ({ ...p, oldPassword: "기존 비밀번호가 올바르지 않습니다." }));
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
        setErrors({ oldPassword: "", newPassword: "", confirmNewPassword: "", mismatch: "" });
    };

    return (
        <div className="edit-password-form">
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
                <p className="field-error-message" role="alert">{errors.oldPassword}</p>
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
                <p className="field-error-message" role="alert">{errors.newPassword}</p>
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
                <p className="field-error-message" role="alert">{errors.confirmNewPassword}</p>
            )}
            {errors.mismatch && (
                <p className="field-error-message" role="alert">{errors.mismatch}</p>
            )}

            {/* 제출/취소 */}
            <div className="edit-password-actions">
                <Button onClick={onSubmit} disabled={isSaving}>
                    {isSaving ? "저장 중..." : "수정하기"}
                </Button>
                <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
                    취소
                </Button>
            </div>
        </div>
    );
}

export default PasswordEdit;