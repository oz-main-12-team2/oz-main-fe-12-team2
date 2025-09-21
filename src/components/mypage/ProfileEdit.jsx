import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import FormGroup from "../common/FormGroup";

// 이메일 정규식 (모달에서 사용하던 로직 이관)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProfileEdit() {
    // 서버에서 불러온 초기값
    const [initial, setInitial] = useState({
        email: "",
        username: "",
        address: "",
    });

    // 폼 상태
    const [form, setForm] = useState({
        email: "",
        username: "",
        address: "",
    });

    // 에러 상태
    const [errors, setErrors] = useState({
        email: "",
        username: "",
    });

    // 로딩/저장 상태
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 변경 여부(Dirty)
    const isDirty = useMemo(
        () =>
        form.email !== initial.email ||
        form.username !== initial.username ||
        form.address !== initial.address,
        [form, initial]
    );

    // 초기 데이터 조회 (엔드포인트는 프로젝트에 맞게 교체)
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                setIsLoading(true);
                // TODO: 실제 API로 교체
                // const res = await fetch("/api/users/me");
                // const data = await res.json();

                // 데모용 (삭제 가능)
                const data = {
                    email: "madwolves98@gmail.com",
                    username: "홍엽",
                    address: "서울시 마포구",
                };

                if (!ignore) {
                    setInitial(data);
                    setForm(data);
                }
            } catch (e) {
                console.error(e);
                // TODO: 토스트/에러 노출
            } finally {
                if (!ignore) setIsLoading(false);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

  // 필드 공통 변경 핸들러
    const onChange = (key) => (e) => {
        const v = e.target.value;
        setForm((prev) => ({ ...prev, [key]: v }));

        // 입력 중에는 관련 에러를 즉시 해제
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
    };

    // 이메일 blur 검증 (모달의 handleBlur 이관)
    const onEmailBlur = () => {
        if (!form.email) {
            setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
            return;
        }
        if (!EMAIL_REGEX.test(form.email)) {
            setErrors((prev) => ({
                ...prev,
                email: "올바른 이메일 형식을 입력해주세요.",
            }));
        }
    };

    // 간단 검증 함수
    const validate = () => {
        const next = { email: "", username: "" };
        if (!form.email) next.email = "이메일을 입력해주세요.";
        else if (!EMAIL_REGEX.test(form.email))
            next.email = "올바른 이메일 형식을 입력해주세요.";
        if (!form.username) next.username = "이름을 입력해주세요.";
        setErrors(next);
        return !next.email && !next.username;
    };

    // 저장
    const onSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSaving(true);
            // TODO: 실제 API로 교체 (PUT /users/me)
            // const res = await fetch("/api/users/me", {
            //   method: "PUT",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(form),
            // });
            // if (!res.ok) throw new Error("저장 실패");

            // 데모용 딜레이
            await new Promise((r) => setTimeout(r, 500));

            setInitial(form); // 저장 성공 시 초기값 갱신
            // TODO: 토스트로 “저장되었습니다”
        } catch (e) {
            console.error(e);
            // TODO: 서버 에러 메시지 맵핑해서 errors에 반영/토스트
        } finally {
            setIsSaving(false);
        }
    };

    // 취소 (변경 취소)
    const onCancel = () => {
        if (isDirty && !window.confirm("변경 사항을 취소할까요?")) return;
        setForm(initial);
        setErrors({ email: "", username: "" });
    };

    if (isLoading) {
        return <div className="profile-edit-loading">불러오는 중…</div>;
    }

    return (
        <div className="edit-data-form">
            {/* 기존 SCSS 오버라이드와 호환되도록 className 유지 */}
            <div className="edit-data-email">
                <FormGroup
                    type="email"
                    label="이메일"
                    value={form.email}
                    onChange={onChange("email")}
                    onBlur={onEmailBlur}
                    error={errors.email}
                    placeholder="example@domain.com"
                />
            </div>

            <div className="edit-data-username">
                <FormGroup
                    type="text"
                    label="유저이름"
                    value={form.username}
                    onChange={onChange("username")}
                    error={errors.username}
                    placeholder="이름을 입력하세요"
                />
            </div>

            <div className="edit-data-address">
                <FormGroup
                    type="text"
                    label="주소"
                    value={form.address}
                    onChange={onChange("address")}
                    placeholder="주소를 입력하세요"
                />
            </div>

            <div className="edit-data-actions">
                <Button
                    onClick={onSubmit}
                    disabled={isSaving || (!isDirty && !errors.email && !errors.username)}
                >
                    {isSaving ? "저장 중..." : "수정하기"}
                </Button>
                <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
                    취소
                </Button>
            </div>
        </div>
    );
}


export default ProfileEdit;