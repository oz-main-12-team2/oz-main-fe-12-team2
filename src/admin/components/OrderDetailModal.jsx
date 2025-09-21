import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

function OrderDetailModal({ order, isOpen, onClose, onDelete }) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="주문 상세"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button variant="danger" onClick={() => onDelete(order.order_number)}>
            삭제
          </Button>
        </>
      }
    >
      <div className="order-info">
        <p>
          <span>주문번호</span> {order.order_number}
        </p>
        <p>
          <span>회원 ID</span> {order.user_id}
        </p>
        <p>
          <span>총 금액</span> {order.total_price.toLocaleString()}원
        </p>
        <p>
          <span>상태</span> {order.status}
        </p>
        <p>
          <span>주문일</span> {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {order.recipient_name && (
        <div className="recipient-info">
          <h4>주문 회원</h4>
          <p>
            <span>이름</span> {order.recipient_name}
          </p>
          <p>
            <span>전화번호</span> {order.recipient_phone}
          </p>
          <p>
            <span>주소</span> {order.recipient_address}
          </p>
        </div>
      )}

      {order.payment && (
        <div className="payment-info">
          <h4>결제 정보</h4>
          <p>
            <span>결제수단</span> {order.payment.method}
          </p>
          <p>
            <span>결제상태</span> {order.payment.status}
          </p>
          <p>
            <span>결제일자</span>{" "}
            {new Date(order.payment.created_at).toLocaleString()}
          </p>
        </div>
      )}

      <h4>주문 상품</h4>
      <table className="order-items-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>수량</th>
            <th>단가</th>
            <th>총 금액</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.product_id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_price.toLocaleString()}원</td>
              <td>{item.total_price.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

export default OrderDetailModal;