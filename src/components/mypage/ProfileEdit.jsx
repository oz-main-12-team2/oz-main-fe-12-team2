import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import FormGroup from "../common/FormGroup";
import Loading from "../common/Loading";
import { getUserMe, updateUserMe } from "../../api/user";
import { alertError, alertSuccess, alertComfirm } from "../../utils/alert";
import AddressAutoComplete from "../AddressAutoComplete";
import "../../styles/profile-edit.scss";

function ProfileEdit() {
  // 서버에서 불러온 초기값
  const [initial, setInitial] = useState({
    email: "",
    name: "",
    address: "",
  });

  // 폼 상태
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
  });

  // 에러 상태
  const [errors, setErrors] = useState({
    email: "",
    name: "",
  });

  // 로딩/저장 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 변경 여부(Dirty)
  const isDirty = useMemo(
    () =>
      form.email !== initial.email ||
      form.name !== initial.name ||
      form.address !== initial.address,
    [form, initial]
  );

  // 초기 데이터 조회 (엔드포인트는 프로젝트에 맞게 교체)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setIsLoading(true);
        const me = await getUserMe();
        if (ignore) return;

        // 데모용 (삭제 가능)
        const data = {
          email: me.email ?? "",
          name: me.name ?? "",
          address: me.address ?? "",
        };

        setInitial(data);
        setForm(data);
      } catch (e) {
        if (!ignore) {
          await alertError("불러오기 실패", e.message || "사용자 정보를 불러오지 못했습니다.");
        }
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

  const normalize = (info) =>
    String(info ?? "")
      .replace(/\u3000/g, " ")   // 전각 공백 → 일반 공백
      .trim()
      .replace(/\s+/g, " ");

  const onAddressSelect = (v) => {
    const str = typeof v === "string" ? v : v?.display || "";
    const norm = normalize(str);
    setForm((prev) => ({ ...prev, address: norm }));
    if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
  };

  // 간단 검증 함수
  const validate = () => {
    const next = { name: "", address: "" };
    const normalizeName = normalize(form.name);
    const normalizeAddress = normalize(form.address);

    if (!normalizeName) next.name = "이름을 입력해주세요.";

    if (!normalizeAddress) next.address = "주소를 입력해주세요.";

    setErrors(next);
    return !next.name && !next.address;
  };

  // 저장
  const onSubmit = async (e) => {
    e?.preventDefault();
    if (isSaving) return;

    const normalizeName = normalize(form.name);
    const normalizeAddress = normalize(form.address);

    if (!isDirty && !errors.name && !errors.address) return;
    if (!validate()) return;

    // ✅ 확인창 띄우기
    const result = await alertComfirm("개인정보 수정", "입력하신 내용으로 수정하시겠습니까?");
    if (!result.isConfirmed) return; // "예" 눌렀을 때만 진행

    try {
      setIsSaving(true);

      const updated = await updateUserMe(normalizeName, normalizeAddress);

      const next = {
        email: updated.email ?? form.email,
        name: updated.name ?? normalizeName,
        address: updated.address ?? normalizeAddress,
      };
      setForm(next);
      setInitial(next);

      await alertSuccess("수정 완료", "개인정보가 업데이트되었습니다.");
      window.location.reload();
    } catch (e) {
      await alertError("수정 실패", e.message || "개인정보 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 취소 (변경 취소)
  const onCancel = async () => {
    if (isDirty && !window.confirm("변경 사항을 취소할까요?")) return;
    setForm(initial);
    setErrors({ name: "", address: "" });
  };

  if (isLoading) {
    return <Loading loadingText="사용자 정보를 불러오는 중" size={44} />;
  }

  return (
    <form className="edit-data-form" onSubmit={onSubmit}>
      {/* 기존 SCSS 오버라이드와 호환되도록 className 유지 */}
      <div className="edit-data-email">
        <FormGroup
          type="email"
          label="이메일"
          value={form.email}
          placeholder="example@domain.com"
          disabled
        />
      </div>

      <div className="edit-data-name">
        <FormGroup
          type="text"
          label="유저이름"
          value={form.name}
          onChange={onChange("name")}
          error={errors.name}
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="edit-data-address">
        {/* <FormGroup
          type="text"
          label="주소"
          value={form.address}
          onChange={onChange("address")}
          error={errors.address}
          placeholder="주소를 입력하세요"
        /> */}
        <div className="input-wrap">
          <label className="input-label">주소</label>

          <AddressAutoComplete
            value={form.address}
            onChangeValue={onAddressSelect}
            placeholder="주소를 입력하세요5"

            // ⬇️ FormGroup 인풋과 동일 클래스
            inputClassName={`input-field ${errors.address ? "input-error" : ""}`}

            // 드롭다운은 별도 클래스 계속 사용
            dropdownClassName="addr-dropdown"
            optionClassName="addr-option"
            // 여기선 errorText 넘기지 말고(중복 방지), 아래에서 통일 렌더
          />

          {errors.address && (
            <span className="input-error-message">{errors.address}</span>
          )}
        </div>
      </div>

      <div className="edit-data-actions">
        <Button
          onClick={onSubmit}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? "저장 중..." : "수정하기"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          취소
        </Button>
      </div>
    </form>
  );
}

export default ProfileEdit;
