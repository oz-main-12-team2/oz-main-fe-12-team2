/**
 * 주문 리스트/상세 공용 헤더
 *
 * Props
 * - showChevron (boolean): 오른쪽 접기/이동 아이콘 칸 표시 여부 (기본 true)
 * - compact (boolean): 모바일 등에서 간격을 줄인 버전 (기본 false)
 * - className (string): 추가 스타일 클래스
 */
export default function OrderTableHeader({ compact = false, className = "" }) {
  return (
    <div className={`orderrow-header ${compact ? "is-compact" : ""} ${className}`}>
      <span className="h h--thumb" />
      <span className="h h--id">주문번호</span>
      <span className="h h--date">주문일</span>
      <span className="h h--recipient">수취인</span>
      <span className="h h--qty">수량</span>
      <span className="h h--total">총액</span>
      <span className="h h--status">상태</span>
    </div>
  );
}