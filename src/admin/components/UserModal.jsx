import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

function UserModal({ isOpen, user, onClose, onToggleActive }) {
  if (!user) return;

  return (
    <Modal
      isOpen={isOpen}
      title="회원 상세 정보"
      onClose={onClose}
      footer={
        <div className="user-modal-footer">
          <div className="footer-left">
            <Button
              variant={user.is_active ? "secondary" : "primary"}
              onClick={onToggleActive}
            >
              {user.is_active ? "비활성화" : "활성화"}
            </Button>
            <Button variant="danger">회원 탈퇴</Button>
          </div>
          <div className="footer-right">
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      }
    >
      <div className="user-info">
        <p>
          <span>ID</span> {user.id}
        </p>
        <p>
          <span>이메일</span> {user.email}
        </p>
        <p>
          <span>이름</span> {user.name}
        </p>
        <p>
          <span>주소</span> {user.address || "-"}
        </p>
        <p>
          <span>소셜로그인</span> {user.is_social ? "Y" : "N"}
        </p>
        <p>
          <span>관리자</span> {user.is_admin ? "Y" : "N"}
        </p>
        <p>
          <span>활성화</span> {user.is_active ? "활성" : "비활성"}
        </p>
        <p>
          <span>가입일</span> {new Date(user.created_at).toLocaleString()}
        </p>
        <p>
          <span>수정일</span> {new Date(user.updated_at).toLocaleString()}
        </p>
      </div>
    </Modal>
  );
}

export default UserModal;
