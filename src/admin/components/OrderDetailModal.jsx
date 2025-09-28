import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import ProductModal from "./ProductModal";
import Select from "../../components/common/Select";
import { updateOrder } from "../../api/admin";
import { alertComfirm, alertError, alertSuccess } from "../../utils/alert";
import FormGroup from "../../components/common/FormGroup";
import phoneFormat from "../../utils/phoneFormat";

const STATUS_OPTIONS = [
  { value: "결제 완료", label: "결제 완료" },
  { value: "배송중", label: "배송중" },
  { value: "배송완료", label: "배송완료" },
];

function OrderDetailModal({ order, isOpen, onClose, onDelete, onUpdate }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setTempRecipientName(order.recipient_name || "");
      setTempRecipientPhone(order.recipient_phone || "");
      setTempRecipientAddress(order.recipient_address || "");
      setTempStatus(order.status || "");
      setIsEditing(false); // 수정중인 상태도 초기화
    }
  }, [isOpen, order]);

  // 배송 정보 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [tempRecipientName, setTempRecipientName] = useState(
    order?.recipient_name || ""
  );
  const [tempRecipientPhone, setTempRecipientPhone] = useState(
    order?.recipient_phone || ""
  );
  const [tempRecipientAddress, setTempRecipientAddress] = useState(
    order?.recipient_address || ""
  );
  const [tempStatus, setTempStatus] = useState(order?.status || "");

  if (!order) return;

  // 상품 클릭 핸들러
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleEditClick = () => {
    setTempRecipientName(order.recipient_name);
    setTempRecipientPhone(order.recipient_phone);
    setTempRecipientAddress(order.recipient_address);
    setTempStatus(order.status);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        recipient_name: tempRecipientName,
        recipient_phone: tempRecipientPhone,
        recipient_address: tempRecipientAddress,
        status: tempStatus,
      };
      const confirm = await alertComfirm(
        "배송 정보 변경",
        "정말로 변경하시겠습니까?"
      );
      if (!confirm.isConfirmed) return;

      const updatedOrder = await updateOrder(order.id, payload);

      // 부모에게 업데이트
      onUpdate(updatedOrder);
      await alertSuccess(
        "배송 정보 변경 성공",
        "배송 정보가 성공적으로 변경되었습니다."
      );
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      await alertError("배송 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.address; // 선택한 기본 주소 (도로명, 지번)
        let extraAddress = ""; // //건물명이나 법정동 등 추가주소정보

        // 법정동/건물명 같이 보조 주소 붙여주기
        if (data.addressType === "R") {
          if (data.bname !== "") extraAddress += data.bname; // 법정동명이 있으면 추가

          // 건물명이 있으면 추가, 이미 법정동이 있으면 쉼표로 구분
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          if (extraAddress !== "") {
            fullAddress += ` (${extraAddress})`;
          }
        }

        setTempRecipientAddress(fullAddress);  // 최종 주소를 상태로 저장 input표시용
      },
    }).open();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="주문 상세"
        onClose={onClose}
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => onDelete(order.order_number)}
            >
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
            <span>주문일</span> {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <span>수정일</span> {new Date(order.updated_at).toLocaleString()}
          </p>
        </div>

        {/* 배송 정보 */}
        <div className="recipient-info">
          <h4 className="recipient-title">
            배송 정보
            {!isEditing && (
              <Button variant="secondary" size="sm" onClick={handleEditClick}>
                수정
              </Button>
            )}
          </h4>

          {isEditing ? (
            <div className="recipient-edit">
              <FormGroup
                label="이름"
                value={tempRecipientName}
                onChange={(e) => setTempRecipientName(e.target.value)}
              />
              <FormGroup
                label="전화번호"
                value={tempRecipientPhone}
                onChange={(e) =>
                  setTempRecipientPhone(phoneFormat(e.target.value))
                }
              />
              {/* 주소 입력 */}
              <FormGroup
                label="주소"
                value={tempRecipientAddress}
                onChange={(e) => setTempRecipientAddress(e.target.value)}
              />
              <Button
                variant="secondary"
                size="md"
                onClick={handleAddressSearch}
                style={{ marginTop: "0.5rem" }}
              >
                주소 검색
              </Button>
              <Select
                label="상태"
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <div className="form-actions">
                <Button variant="primary" size="md" onClick={handleSave}>
                  저장
                </Button>
                <Button variant="secondary" size="md" onClick={handleCancel}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p>
                <span>이름</span> {order.recipient_name}
              </p>
              <p>
                <span>전화번호</span> {order.recipient_phone}
              </p>
              <p>
                <span>주소</span> {order.recipient_address}
              </p>
              <p>
                <span>상태</span> {order.status}
              </p>
            </>
          )}
        </div>

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
