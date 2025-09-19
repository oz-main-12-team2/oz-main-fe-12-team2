import { useState } from "react";
import { alertComfirm } from "../../utils/alert";
import Select from "../../components/common/Select";

const STATUS_OPTIONS = [
  { value: "결제완료", label: "결제완료" },
  { value: "배송중", label: "배송중" },
  { value: "배송완료", label: "배송완료" },
];

function StatusCell({ value, orderNumber, onChangeStatus }) {
  const [tempStatus, setTempStatus] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    const res = await alertComfirm("주문상태 변경", "변경하시겠습니까?");
    if (!res.isConfirmed) return;

    onChangeStatus(orderNumber, tempStatus);
    setIsEditing(false);
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