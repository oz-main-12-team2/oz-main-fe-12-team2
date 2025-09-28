import { useMemo, useState } from "react";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
import AddressAutoComplete from "../components/AddressAutoComplete";
import Modal from "../components/common/Modal"; // ✅ 이미 있는 모달
import { alertError, alertSuccess, alertComfirm } from "../utils/alert";
// import { createOrder, createPayment } from "../api/order"; // 앞서 만든 axios 래퍼 (orders/payments)
import "../styles/checkoutpage.scss";

const METHODS = ["카드", "계좌이체", "휴대폰 결제"];

function normalizePhone(v) {
  return String(v ?? "").replace(/[^\d]/g, "").slice(0, 20);
}

// function CheckoutPage({ selectedItems = [] }) {
function CheckoutPage() {
  // 수취인 폼
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [address, setAddress] = useState("");

  // 상태
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" });
  // const [submitting, setSubmitting] = useState(false);

  // 결제 모달
  const [openPayModal, setOpenPayModal] = useState(false);
  const [method, setMethod] = useState(METHODS[0]);

  const phone = useMemo(() => normalizePhone(phoneInput), [phoneInput]);

  const validate = () => {
    const next = { name: "", phone: "", address: "" };
    const n = (name ?? "").trim();
    const a = (address ?? "").replace(/\u3000/g, " ").trim();

    if (!n) next.name = "수취인 이름을 입력해주세요.";
    else if (n.length > 10) next.name = "이름은 10자 이내여야 합니다.";

    if (!phone) next.phone = "연락처를 입력해주세요.";
    if (!a) next.address = "주소를 입력해주세요.";

    setErrors(next);
    return !next.name && !next.phone && !next.address;
  };

  const onClickPay = (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setOpenPayModal(true);
  };

  const onConfirmPay = async () => {
    const { isConfirmed } = await alertComfirm("결제 진행", `선택한 결제수단: ${method}\n계속 진행할까요?`);
    if (!isConfirmed) return;

    // try {
    //   setSubmitting(true);

    //   // 1) 주문 생성
    //   const order = await createOrder({
    //     recipient_name: name.trim(),
    //     recipient_phone: phone,
    //     recipient_address: address.trim(),
    //     selected_items: selectedItems, // [int,...]
    //   });

    //   // 서버가 어떤 키로 id를 주는지에 따라 보정
    //   const orderId = order?.id ?? order?.order_id ?? order?.order?.id;
    //   if (!orderId) throw new Error("주문 번호를 확인할 수 없습니다.");

    //   // 2) 결제 생성 (대기)
    //   const payment = await createPayment({
    //     order_id: orderId,
    //     method,
    //     status: "대기",
    //   });

    //   await alertSuccess("주문 접수", `주문번호 #${payment.order_id}로 접수되었습니다.`);
    //   // TODO: navigate(`/orders/${orderId}`);
    // } catch (e) {
    //   await alertError("결제 실패", e.message || "주문/결제 처리 중 문제가 발생했습니다.");
    // } finally {
    //   setSubmitting(false);
    //   setOpenPayModal(false);
    // }
  };

  return (
    <>
      <div className="checkout-container base-container">
        <h1 className="checkout-title">결제</h1>

        {/* 수취인 폼 */}
        <div className="checkout-form">
          <FormGroup
            label="수취인 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="홍길동"
          />
          <FormGroup
            label="연락처"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            error={errors.phone}
            placeholder="01012345678"
          />
          <div className="edit-data-address">
            <label className="input-label">주소</label>
            <AddressAutoComplete
              value={address}
              onChangeValue={setAddress}
              placeholder="주소 검색"
              errorText={errors.address}
              // signup과 동일 스타일을 쓰고 싶다면 동일 클래스 사용
              className="address-autocomplete"
              inputClassName="form-input"
              dropdownClassName="addr-dropdown"
              optionClassName="addr-option"
            />
          </div>

          <div className="checkout-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={onClickPay}
              // disabled={submitting || selectedItems.length === 0}
            >
              {/* {submitting ? "처리 중..." : "결제하기"} */}
              결제하기
            </Button>
            <Button
              variant="secondary"
              size="lg"
            >
              취소하기
            </Button>
          </div>
        </div>

        {/* ✅ 결제수단 선택 모달: 공용 Modal 컴포넌트 사용 */}
        <Modal
          isOpen={openPayModal}
          title="결제 수단 선택"
          // onClose={() => !submitting && setOpenPayModal(false)}
          footer={
            <>
              <Button 
                variant="secondary" 
                onClick={() => setOpenPayModal(false)} disabled={submitting}
              >
                취소
              </Button>
              <Button 
                variant="primary" 
                onClick={onConfirmPay} 
                // disabled={submitting}
              >
                {submitting ? "처리 중..." : "확인"}
              </Button>
            </>
          }
        >
          <div className="method-list">
            {METHODS.map((m) => (
              <label key={m} className="method-item">
                <input
                  type="radio"
                  name="pay-method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </Modal>
      </div>
    </>
  )
}

export default CheckoutPage;