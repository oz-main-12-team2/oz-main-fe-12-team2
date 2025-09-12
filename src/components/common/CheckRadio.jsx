
import "../../styles/checkradio.scss";

/**
 * Checkbox 컴포넌트
 *
 * 커스텀 스타일이 적용된 체크박스 UI
 *
 * ## Props
 * - `label` (string): 체크박스 옆에 표시할 텍스트
 * - `id` (string, optional): 고유 ID, 랜덤 ID 자동 생성
 * - `...rest`: input[type="checkbox"]에 전달되는 기본 속성
 *   (예: `checked`, `defaultChecked`, `onChange`, `disabled` 등)
 *
 * ## 사용 예시
 * ```jsx
 * // 기본 체크박스
 * <Checkbox label="동의합니다" />
 *
 * // 제어 컴포넌트 (state와 연결)
 * <Checkbox
 *   label="이용약관 동의"
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 * />
 *
 * // 비활성화된 체크박스
 * <Checkbox label="선택 불가" disabled />
 * ```
 */
export function Checkbox({ label, ...rest }) {
  const id = `checkbox-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <label htmlFor={id} className="checkbox-label">
      <input id={id} type="checkbox" className="checkbox-input" {...rest} />
      <span className="checkbox-custom" />
      {label}
    </label>
  );
}


/**
 * Radio 컴포넌트
 *
 * 커스텀 스타일이 적용된 라디오 버튼 UI
 *
 * ## Props
 * - `label` (string): 라디오 옆에 표시할 텍스트
 * - `name` (string): 라디오 그룹 이름 (같은 name을 가진 라디오끼리 그룹화됨)
 * - `id` (string, optional): 고유 ID. ID 자동 생성
 * - `...rest`: input[type="radio"]에 전달되는 기본 속성
 *   (예: `checked`, `defaultChecked`, `onChange`, `disabled` 등)
 *
 * ## 사용 예시
 * ```jsx
 * // 기본 라디오 버튼 (같은 name을 가진 라디오끼리만 단일 선택 가능)
 * <Radio name="gender" label="남성" />
 * <Radio name="gender" label="여성" />
 * <Radio name="gender" label="여성" />
 * <Radio name="gender" label="여성" />
 * <Radio name="gender" label="여성" />
 * <Radio name="gender" label="여성" />
 *
 * // 제어 컴포넌트 (state와 연결)
 * <Radio
 *   name="payment"
 *   label="카드 결제"
 *   checked={payment === "card"}
 *   onChange={() => setPayment("card")}
 * />
 * <Radio
 *   name="payment"
 *   label="계좌 이체"
 *   checked={payment === "bank"}
 *   onChange={() => setPayment("bank")}
 * />
 *
 * // 비활성화된 라디오 버튼
 * <Radio name="option" label="선택 불가" disabled />
 * ```
 */
export function Radio({ label, name, ...rest }) {
  const id = `radio-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <label htmlFor={id} className="checkbox-label">
      <input id={id} type="radio" name={name} className="radio-input" {...rest} />
      <span className="radio-custom" />
      {label}
    </label>
  );
}