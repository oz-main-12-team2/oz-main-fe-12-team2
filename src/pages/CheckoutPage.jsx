import { useMemo, useState } from "react";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
// import AddressAutoComplete from "../components/AddressAutoComplete";
import Modal from "../components/common/Modal"; // ✅ 이미 있는 모달
import { alertError, alertSuccess, alertComfirm } from "../utils/alert";
// import { createOrder, createPayment } from "../api/order"; // 앞서 만든 axios 래퍼 (orders/payments)
import "../styles/checkoutpage.scss";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { BookListRow } from "../components/common/BookListRow";

const METHODS = ["카드", "계좌이체", "휴대폰 결제"];

function normalizePhone(v) {
  return String(v ?? "").replace(/[^\d]/g, "").slice(0, 20);
}

// function CheckoutPage({ selectedItems = [] }) {
function CheckoutPage() {
  const KRW = (n) => n.toLocaleString("ko-KR");
  // ✅ 더미 데이터 (장바구니에서 선택된 상품 가정)
  const dummyBooks = [
    {
      id: 1,
      name: "모던 자바스크립트 Deep Dive",
      category: "프로그래밍",
      author: "이웅모",
      publisher: "위키북스",
      price: 42000,
      image_url: "/no-image.jpg",
      isSoldOut: false,
    },
    {
      id: 2,
      name: "Clean Code",
      category: "소프트웨어 공학",
      author: "Robert C. Martin",
      publisher: "인사이트",
      price: 33000,
      image_url: "/no-image.jpg",
      isSoldOut: false,
    },
    {
      id: 3,
      name: "운영체제 공룡책",
      category: "컴퓨터 공학",
      author: "Abraham Silberschatz",
      publisher: "Wiley",
      price: 55000,
      image_url: "/no-image.jpg",
      isSoldOut: true, // 품절 표시
    },
  ];

  // ✅ 합계/수량
  const { totalQty, subtotal } = useMemo(() => {
    return dummyBooks.reduce(
      (acc, b) => {
        acc.totalQty += Number(b.qty || 0);
        acc.subtotal += Number(b.price || 0) * Number(b.qty || 0);
        return acc;
      },
      { totalQty: 0, subtotal: 0 }
    );
  }, []);

  const navigate = useNavigate();

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

  const [tempRecipientAddress, setTempRecipientAddress] = useState("");

  const phone = useMemo(() => normalizePhone(phoneInput), [phoneInput]);

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
        setAddress(fullAddress);   // 주소 검증용 state도 함께 갱신
      },
    }).open();
  };

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

  const onClickCancel = () => {
    navigate("/cart")
  }

  const onConfirmPay = async () => {
    const { isConfirmed } = await alertComfirm("결제 진행", `선택한 결제수단: ${method}\n계속 진행할까요?`);
    if (!isConfirmed) return;

    try {
      // setSubmitting(true);

      // 1) 주문 생성
      // const order = await createOrder({
      //   recipient_name: name.trim(),
      //   recipient_phone: phone,
      //   recipient_address: address.trim(),
      //   selected_items: selectedItems, // [int,...]
      // });

      // 서버가 어떤 키로 id를 주는지에 따라 보정
      // const orderId = order?.id ?? order?.order_id ?? order?.order?.id;
      // if (!orderId) throw new Error("주문 번호를 확인할 수 없습니다.");

      // 2) 결제 생성 (대기)
      // const payment = await createPayment({
      //   order_id: orderId,
      //   method,
      //   status: "대기",
      // });

      // await alertSuccess("주문 접수", `주문번호 #${payment.order_id}로 접수되었습니다.`);
      await alertSuccess("주문 접수", `주문번호로 접수되었습니다.`);
      // TODO: navigate(`/orders/${orderId}`);
    } catch (e) {
      await alertError("결제 실패", e.message || "주문/결제 처리 중 문제가 발생했습니다.");
    } finally {
      // setSubmitting(false);
      setOpenPayModal(false);
    }
  };

  return (
    <>
      <Header />
      <div className="base-container">
        <div className="checkout-container">
          {/* <Link to="/">
            <img className="checkout-logo" src="/new-logo.svg" alt="러블리 로고" />
          </Link> */}
          <div className="selected-products">
            <h1 className="selected-products-title">선택한 상품 목록</h1>

            <BookListRow
              books={dummyBooks}
              buttonActions={(book) => (
                <button onClick={() => console.log("삭제:", book.id)}>삭제</button>
              )}
              leftActions={(book) => (
                <input
                  type="checkbox"
                  value={book.id}
                  defaultChecked={!book.isSoldOut}
                />
              )}
            />

            <div className="order-summary">
              <div className="summary-row">
                <span>총 수량</span>
                <strong>{totalQty}개</strong>
              </div>
              <div className="summary-row">
                <span>상품 합계</span>
                <strong>{KRW(subtotal)}원</strong>
              </div>
              {/* 배송비/할인 등 정책 생기면 여기 추가 */}
              <div className="summary-row summary-total">
                <span>결제 예정 금액</span>
                <strong>{KRW(subtotal)}원</strong>
              </div>
            </div>
          </div>

          {/* 수취인 폼 */}
          <div className="checkout-form">
            <h1 className="checkout-title">수취인 정보 입력</h1>

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
            {/* <div className="edit-data-address">
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
            </div> */}
            <FormGroup
              label="주소"
              value={tempRecipientAddress}
              onChange={(e) => setTempRecipientAddress(e.target.value)}
            />
            <Button
              variant="secondary"
              size="md"
              onClick={handleAddressSearch}
            >
              주소 검색
            </Button>

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
                onClick={onClickCancel}
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
                  // onClick={() => setOpenPayModal(false)} disabled={submitting}
                  onClick={() => setOpenPayModal(false)}
                >
                  취소
                </Button>
                <Button 
                  variant="primary" 
                  onClick={onConfirmPay} 
                  // disabled={submitting}
                >
                  {/* {submitting ? "처리 중..." : "확인"} */}
                  확인
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
      </div>
      <Footer />
    </>
  )
}

export default CheckoutPage;