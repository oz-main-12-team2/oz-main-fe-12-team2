import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { alertComfirm, alertError, alertSuccess } from "../../utils/alert";
import { formatDateShort } from "../../utils/dateFormat";
import { cancelPayment } from "../../api/admin";

function PaymentDetailModal({ payment, isOpen, onClose, onUpdate, onDelete }) {
  if (!payment) return null;

  const handleCancelPayment = async () => {
    const confirm = await alertComfirm("결제 취소", "정말로 취소하시겠습니까?");
    if (!confirm.isConfirmed) return;

    try {
      const updated = await cancelPayment(payment.id);
      onUpdate(updated); // 부모 상태 업데이트
      await alertSuccess("결제 취소 완료", "결제가 취소되었습니다.");
      onClose();
    } catch (e) {
      console.error('결제 취소 오류 : ',e);
      await alertError("결제 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="결제 상세"
      onClose={onClose}
      footer={
        <>
          {payment.status !== "취소" && (
            <Button variant="danger" onClick={handleCancelPayment}>
              결제 취소
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </>
      }
    >
      {/* 기본 결제 정보 */}
      <div className="payment-info">
        <p>
          <span>결제번호</span> {payment.transaction_id || "-"}
        </p>
        <p>
          <span>주문번호</span> {payment.order_id}
        </p>
        <p>
          <span>회원</span> {payment.user?.email || "-"}
        </p>
        <p>
          <span>결제금액</span> {Number(payment.total_price).toLocaleString()}원
        </p>
        <p>
          <span>결제수단</span> {payment.method}
        </p>
        <p>
          <span>상태</span>{" "}
          <span className={`status-text ${payment.status}`}>
            {payment.status}
          </span>
        </p>
        <p>
          <span>결제일자</span> {formatDateShort(payment.created_at)}
        </p>
      </div>
    </Modal>
  );
}

export default PaymentDetailModal;
