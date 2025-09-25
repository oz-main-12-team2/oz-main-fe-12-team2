import { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import ProductModal from "./ProductModal";
import { formatDateShort } from "../../utils/dateFormat";

function OrderDetailModal({ order, isOpen, onClose, onDelete }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  if (!order) return;

  // 상품 클릭 핸들러
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="주문 상세"
        onClose={onClose}
        footer={
          <>
            <Button variant="danger" onClick={() => onDelete(order.order_number)}>
              삭제
            </Button>
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          </>
        }
      >
        {/* 기본 주문 정보 */}
        <div className="order-info">
          <p>
            <span>주문번호</span> {order.order_number}
          </p>
          <p>
            <span>회원 ID</span> {order.user}
          </p>
          <p>
            <span>총 금액</span> {Number(order.total_price).toLocaleString()}원
          </p>
          <p>
            <span>상태</span> {order.status}
          </p>
          <p>
            <span>주문일</span> {formatDateShort(order.created_at)}
          </p>
          <p>
            <span>수정일</span> {formatDateShort(order.updated_at)}
          </p>
        </div>

        {/* 수령인 정보 */}
        {(order.recipient_name || order.recipient_phone) && (
          <div className="recipient-info">
            <h4>배송 정보</h4>
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

        {/* 주문 상품 리스트 */}
        <h4>주문 상품</h4>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>이미지</th>
              <th>상품명</th>
              <th>저자</th>
              <th>출판사</th>
              <th>수량</th>
              <th>단가</th>
              <th>총 금액</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleProductClick(item.product)} // 클릭하면 상품 모달 열림
              >
                <td>
                  <img
                    src={item.product.image_url || "/no-image.jpg"}
                    alt={item.product.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.jpg";
                    }}
                  />
                </td>
                <td>{item.product.name}</td>
                <td>{item.product.author}</td>
                <td>{item.product.publisher}</td>
                <td>{item.quantity}</td>
                <td>{Number(item.unit_price).toLocaleString()}원</td>
                <td>{Number(item.total_price).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      {/* 상품 상세 모달 */}
      {selectedProduct && (
        <ProductModal
          isOpen={isProductModalOpen}
          isEditMode={false} // 상세보기 모드로 열기
          selectedBook={selectedProduct}
          onClose={() => setIsProductModalOpen(false)}
          onDelete={() => {}} // 주문 상세에서는 삭제 안쓰면 빈 함수 처리
          onSave={() => {}}
          onEditModeChange={() => {}}
          setSelectedBook={setSelectedProduct}
          errors={{}}
        />
      )}
    </>
  );
}

export default OrderDetailModal;