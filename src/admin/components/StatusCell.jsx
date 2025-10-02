import { useEffect, useState } from "react";
import { alertComfirm, alertError, alertSuccess } from "../../utils/alert";
import Select from "../../components/common/Select";
import { updateOrder } from "../../api/admin";

const STATUS_OPTIONS = [
  { value: "주문 완료", label: "주문 완료" },
  { value: "배송중", label: "배송중" },
  { value: "배송완료", label: "배송완료" },
];

function StatusCell({ value, orderId, orderData, onChangeStatus }) {
  const [tempStatus, setTempStatus] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

   // 부모에서 value(props)가 바뀌면state 동기화
  useEffect(() => {
    setTempStatus(value);
    setIsEditing(false);
  }, [value]);

  const handleSave = async (e) => {
    e.stopPropagation();
    const confirm = await alertComfirm("주문상태 변경", "변경하시겠습니까?");
    if (!confirm.isConfirmed) return;

    try {
      // api 호출
      const updatedOrder = await updateOrder(orderId, {
        recipient_name: orderData.recipient_name,
        recipient_phone: orderData.recipient_phone,
        recipient_address: orderData.recipient_address,
        status: tempStatus,
      });

      // 부모에 업데이트된 order 전달
      onChangeStatus(updatedOrder);

      setIsEditing(false);
      await alertSuccess("주문 상태변경 완료", "변경이 완료되었습니다");
    } catch (e) {
      console.error(e);
      alertError("주문 상태변경 에러", "변경 중 오류가 발생했습니다.");
      setTempStatus(value); // 원래 값 복구
      setIsEditing(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setTempStatus(value); // 원래 값 복구
    setIsEditing(false);
  };

  return (
    <div className="status-cell">
      <Select
        value={tempStatus}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          setTempStatus(e.target.value);
          setIsEditing(true);
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {isEditing && (
        <div className="status-actions">
          <button className="btn-save" onClick={handleSave}>
            저장
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            취소
          </button>
        </div>
      )}
    </div>
  );
}

export default StatusCell;
