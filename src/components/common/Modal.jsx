import "../../styles/modal.scss";

/**
 * Modal 컴포넌트
 *
 * 화면 중앙에 떠 있는 다이얼로그(모달) UI
 *
 * ## Props
 * - `isOpen` (boolean): 모달 열림/닫힘 상태  
 *   - `true` → 모달 표시  
 *   - `false` → 모달 숨김 (렌더링 안 됨)
 *
 * - `title` (string, optional): 모달 상단에 표시할 제목
 *
 * - `children` (ReactNode): 모달 본문(`modal-body`)에 들어갈 내용
 *
 * - `onClose` (function): 모달 닫기 이벤트 핸들러  
 *   - 오버레이 영역을 클릭하면 실행됨
 *
 * - `footer` (ReactNode, optional): 모달 하단 영역(`modal-footer`)에 들어갈 버튼/액션
 *
 * ## 동작
 * - `isOpen`이 `false`면 `null`을 반환 → 모달 자체가 렌더링되지 않음
 * - 바깥 영역(`modal-overlay`) 클릭 시 `onClose` 호출 → 모달 닫기 동작
 * - 모달 내부(`modal-content`) 클릭은 `e.stopPropagation()`으로 이벤트 버블링 방지 → 내부 클릭 시 닫히지 않음
 *
 * ## 사용 예시
 * ```jsx
 * // 1. 기본 모달
 * <Modal
 *   isOpen={isModalOpen}
 *   title="알림"
 *   onClose={() => setIsModalOpen(false)}
 * >
 *   <p>정말 삭제하시겠습니까?</p>
 * </Modal>
 *
 * // 2. 푸터 버튼이 있는 모달
 * <Modal
 *   isOpen={isModalOpen}
 *   title="회원 탈퇴"
 *   onClose={() => setIsModalOpen(false)}
 *   footer={
 *     <>
 *       <button onClick={() => setIsModalOpen(false)}>취소</button>
 *       <button className="btn-danger">탈퇴하기</button>
 *     </>
 *   }
 * >
 *   <p>탈퇴 후에는 계정을 복구할 수 없습니다.</p>
 * </Modal>
 *
 * // 3. 제목 없는 모달 (컨텐츠만 표시)
 * <Modal isOpen={open} onClose={() => setOpen(false)}>
 *   <p>로그인이 필요합니다.</p>
 * </Modal>
 * ```
 */

function Modal({ isOpen, title, children, onClose, footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
