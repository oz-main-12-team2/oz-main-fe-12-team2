import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { alertComfirm, alertError, alertSuccess } from "../../utils/alert";
import { cancelPayment, getOrderDetail } from "../../api/admin";
import OrderDetailModal from "./OrderDetailModal";

function PaymentDetailModal({ payment, isOpen, onClose, onUpdate }) {
  const [localPayment, setLocalPayment] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLocalPayment(payment);
    } else {
      setLocalPayment(null);
      setOrderDetail(null);
      setIsOrderModalOpen(false);
    }
  }, [isOpen, payment]);

  if (!localPayment) return null;

  const handleCancelPayment = async () => {
    const confirm = await alertComfirm("결제 취소", "정말로 취소하시겠습니까?");
    if (!confirm.isConfirmed) return;

    try {
      const updated = await cancelPayment(localPayment.id);

      setLocalPayment(updated.data); // 로컬 상태만 업데이트하여 모달 내 변경 즉시 반영

      if (onUpdate) onUpdate(); // 부모 컴포넌트에 새로고침 신호 전달

      await alertSuccess("결제 취소 완료", "결제가 취소되었습니다.");
    } catch (e) {
      console.error("결제 취소 오류 : ", e);
      await alertError("결제 취소 중 오류가 발생했습니다.");
    }
  };

  const handleOpenOrderDetail = async () => {
    try {
      const detail = await getOrderDetail(localPayment.order_id);
      setOrderDetail(detail);
      setIsOrderModalOpen(true);
    } catch (e) {
      console.error("주문 상세 불러오기 실패:", e);
      await alertError("주문 상세를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="결제 상세"
        onClose={onClose}
        footer={
          <>
            {localPayment.status === "성공" && (
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
        <div className="payment-info">
          <p>
            <span>결제번호</span> {localPayment.transaction_id || "-"}
          </p>
          <p>
            <span>주문번호</span> {localPayment.order_id}{" "}
            <Button
              size="sm"
              variant="secondary"
              style={{ marginLeft: "8px" }}
              onClick={handleOpenOrderDetail}
            >
              주문 상세보기
            </Button>
          </p>
          <p>
            <span>회원</span> {localPayment.user?.email || "-"}
          </p>
          <p>
            <span>결제금액</span>{" "}
            {Number(localPayment.total_price).toLocaleString()}원
          </p>
          <p>
            <span>결제수단</span> {localPayment.method}
          </p>
          <p>
            <span>상태</span>{" "}
            <span className={`status-text ${localPayment.status}`}>
              {localPayment.status}
            </span>
          </p>
          <p>
            <span>결제일자</span>{" "}
            {new Date(localPayment.created_at).toLocaleString()}
          </p>
        </div>
      </Modal>

      {orderDetail && (
        <OrderDetailModal
          order={orderDetail}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onDelete={() => {}}
          onUpdate={(updated) => setOrderDetail(updated)}
        />
      )}
    </>
  );
}

export default PaymentDetailModal;
