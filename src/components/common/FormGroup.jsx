import "../../styles/formgroup.scss";

/**
 * FormGroup 컴포넌트
 *
 * 라벨, 입력 필드, 에러 메시지를 포함한 공용 Input UI
 *
 * ## Props
 * - `label` (string, optional): 입력 필드 위에 표시할 라벨 텍스트
 * - `error` (string, optional): 에러 메시지. 값이 있으면 빨간색 스타일(`input-error`) 적용
 * - `onChange` (function, optional): 입력값 변경 이벤트 핸들러
 *   - (e: React.ChangeEvent<HTMLInputElement>) => void
 * - `onBlur` (function, optional): 포커스 아웃 이벤트 핸들러
 *   - (e: React.FocusEvent<HTMLInputElement>) => void
 * - `...rest`: `<input>`에 전달되는 기본 속성들
 *   - (예: `type`, `value`, `defaultValue`, `placeholder`, `disabled`, `required` 등)
 *
 * ## 동작
 * - `label`이 전달되면 자동으로 `<label>`이 렌더링되고, input과 연결됨
 * - `error`가 존재하면 input에 `input-error` 클래스가 추가되고, 하단에 에러 메시지 표시됨
 *
 * ## 사용 예시
 * ```jsx
 * // 기본 입력창
 * <FormGroup label="이메일" type="email" placeholder="example@email.com" />
 *
 * // 상태와 연결된 제어 컴포넌트
 * <FormGroup
 *   label="비밀번호"
 *   type="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   onBlur={handleBlur}
 * />
 *
 * // 에러 메시지가 있는 경우
 * <FormGroup
 *   label="닉네임"
 *   value={nickname}
 *   onChange={(e) => setNickname(e.target.value)}
 *   error="닉네임은 2글자 이상이어야 합니다."
 * />
 *
 * // 비활성화된 입력창
 * <FormGroup label="이름" value="홍길동" disabled />
 * ```
 */

function FormGroup({ label, error, onChange, onBlur, type = "text", ...rest }) {
  const id = `input-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <div className="input-wrap">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={id}
          className={`input-field textarea-field ${error ? "input-error" : ""}`}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={`input-field ${error ? "input-error" : ""}`}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />
      )}

      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default FormGroup;
