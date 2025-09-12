import "../../styles/button.scss";

/**
 * 공용 UI Button 컴포넌트
 *
 * ## Props
 * - `variant` (string): 버튼 스타일 종류
 *   - `"primary"` (기본값) | `"secondary"` | 'danger'
 *
 * - `size` (string): 버튼 크기
 *   - `"sm"` | `"md"` (기본값) | `"lg"`
 *
 * - `disabled` (boolean): 버튼 비활성화 여부 (기본값: `false`)
 *
 * - `type` (string): 버튼 타입
 *   - `"button"` (기본값) | `"submit"` | `"reset"`
 *
 * - `children` (ReactNode): 버튼 안에 들어갈 텍스트/아이콘
 *
 * - `...rest`: 추가로 전달되는 props (예: onClick, aria-label 등)
 *
 * ## 사용 예시
 * ```jsx
 * <Button onClick={handleClick}>기본 버튼</Button>
 *
 * <Button variant="secondary" size="sm">
 *   작은 보조 버튼
 * </Button>
 *
 * <Button size="lg" disabled>
 *   비활성화 버튼
 * </Button>
 *
 * <Button type="submit" variant="primary" onclick={handleSubmit}>
 *   제출하기
 * </Button>
 * ```
 */

function Button({
  children,
  variant = "primary", // primary | secondary
  size = "md", // sm | md | lg
  disabled = false,
  type = "button",
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size}`;

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
