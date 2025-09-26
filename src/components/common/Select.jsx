import "../../styles/select.scss";


/**
 * Select 컴포넌트
 *
 * 라벨, 셀렉트 박스, 에러 메시지를 포함한 공용 드롭다운 UI
 *
 * ## Props
 * - `label` (string, optional): 셀렉트 박스 위에 표시할 라벨 텍스트
 *
 * - `error` (string, optional): 에러 메시지
 *   - 값이 있으면 `select-error` 클래스가 추가되고, 하단에 에러 메시지 표시
 *
 * - `children` (ReactNode): `<option>` 요소들을 포함 (드롭다운 선택 항목)
 *
 * - `id` (string, optional): 셀렉트와 라벨을 연결하는 고유 ID, 자동 생성
 *
 * - `...rest`: `<select>` 태그에 전달되는 기본 속성들
 *   - (예: `value`, `defaultValue`, `onChange`, `disabled`, `required` 등)
 *
 * ## 동작
 * - `label`이 있으면 자동으로 `<label>` 태그가 생성되고 select와 연결됨
 * - `error`가 존재하면 스타일이 바뀌고 에러 메시지 노출
 *
 * ## 사용 예시
 * ```jsx
 * // 1. 기본 사용
 * <Select label="언어 선택" onChange={(e) => setLang(e.target.value)}>
 *   <option value="">선택하세요</option>
 *   <option value="ko">한국어</option>
 *   <option value="en">English</option>
 * </Select>
 *
 * // 2. 상태와 연결된 제어 컴포넌트
 * <Select
 *   label="직업"
 *   value={job}
 *   onChange={(e) => setJob(e.target.value)}
 * >
 *   <option value="">선택</option>
 *   <option value="dev">개발자</option>
 *   <option value="designer">디자이너</option>
 *   <option value="pm">기획자</option>
 * </Select>
 *
 * // 3. 에러 메시지가 있는 경우
 * <Select
 *   label="카테고리"
 *   value={category}
 *   onChange={(e) => setCategory(e.target.value)}
 *   error="카테고리를 선택해주세요."
 * >
 *   <option value="">선택</option>
 *   <option value="1">전자제품</option>
 *   <option value="2">의류</option>
 * </Select>
 *
 * // 4. 비활성화된 셀렉트
 * <Select label="회원 등급" value="gold" disabled>
 *   <option value="silver">실버</option>
 *   <option value="gold">골드</option>
 *   <option value="platinum">플래티넘</option>
 * </Select>
 * ```
 */

function Select({ label, error, children, ...rest }) {
  const id = `select-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <div className="select-wrap">
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`select-field ${error ? "select-error" : ""}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
}

export default Select;
