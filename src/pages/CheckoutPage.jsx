import { useMemo, useState, useEffect } from "react";
import FormGroup from "../components/common/FormGroup";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal"; // ✅ 이미 있는 모달
import { alertError, alertSuccess, alertComfirm } from "../utils/alert";
import { createOrder, createPayment } from "../api/order"; // 앞서 만든 axios 래퍼 (orders/payments)
import "../styles/checkoutpage.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookListRow } from "../components/common/BookListRow";
import phoneFormat from "../utils/phoneFormat";
import useCartStore from "../stores/cartStore";
import { addCart, getCart } from "../api/cart";
import { Radio } from "../components/common/CheckRadio";

const METHODS = ["카드", "계좌이체", "휴대폰 결제"];
const KRW = (n) => n.toLocaleString("ko-KR");

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const setStoreCartItems = useCartStore((s) => s.setCartItems);

  // ✅ CartPage에서 넘어온 선택 상품들: [{ book, quantity }]
  const buyProducts = useMemo(
    () =>
      Array.isArray(location.state?.buyProducts)
        ? location.state.buyProducts
        : [],
    [location.state]
  );

  const buyPath = location.state.path;

  // 주문 API에 보낼 선택 아이템 ID 배열
  // 백엔드가 '장바구니 아이템 ID'를 요구한다면 여기에서 p.cart_item_id 같은 필드로 바꾸세요.
  const selectedItemIds = useMemo(
    () =>
      buyProducts
        .map((p) => p.book?.id ?? p.id) // book.id 우선, 없으면 p.id
        .filter(Boolean),
    [buyProducts]
  );

  // id -> quantity 맵
  const qtyMap = useMemo(() => {
    const m = new Map();
    for (const it of buyProducts) {
      m.set(it.book.id, Number(it.quantity || 0));
    }
    return m;
  }, [buyProducts]);

  // state가 없거나 비었으면 장바구니로 돌려보내기
  useEffect(() => {
    // direct로 진입한 경우에만 장바구니 추가
    const autoAddToCartIfDirect = async () => {
      if (buyPath === "direct" && buyProducts.length > 0) {
        try {
          // 현재 장바구니 상품 id 조회
          const cartData = await getCart();
          const cartId = Array.isArray(cartData[0]?.items)
            ? cartData[0].items.map((item) => item.product_id)
            : [];

          // 선택상품 중 장바구니에 없는 것만 추가
          await Promise.all(
            buyProducts.map(async (item) => {
              if (!cartId.includes(item.book.id)) {
                await addCart({
                  productId: item.book.id,
                  quantity: item.quantity,
                });
              }
            })
          );
          // 장바구니 상품 재적재 등 필요에 따라 추가
        } catch (e) {
          alertError(
            "장바구니 추가 오류",
            e.message || "장바구니에 상품을 담는 중 오류가 발생했습니다."
          );
          navigate("/cart", { replace: true });
        }
      }
    };

    autoAddToCartIfDirect();
  }, [buyPath, buyProducts, navigate]);

  // 👉 BookListRow가 기대하는 형태로 매핑 (row 카드 규격)
  //    - image_url, name, price, id 등은 book 객체에서 꺼냄
  //    - 수량 표시는 leftActions에서, 여기선 qty만 실어둠
  const booksForRow = useMemo(
    () =>
      buyProducts.map((item) => ({
        id: item.book.id,
        name: item.book.name,
        category: item.book.category,
        author: item.book.author,
        publisher: item.book.publisher,
        price: Number(item.book.price || 0),
        image_url: item.book.image,
        isSoldOut: item.book.stock === 0,
      })),
    [buyProducts]
  );

  // ✅ 총 수량/총액
  const { totalQty, subtotal } = useMemo(() => {
    return booksForRow.reduce(
      (acc, b) => {
        const q = qtyMap.get(b.id) || 0;
        acc.totalQty += q;
        acc.subtotal += q * b.price;
        return acc;
      },
      { totalQty: 0, subtotal: 0 }
    );
  }, [booksForRow, qtyMap]);

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
  const [submitting, setSubmitting] = useState(false);

  // const [tempRecipientAddress, setTempRecipientAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");

  // const phone = useMemo(() => normalizePhone(phoneInput), [phoneInput]);

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

        setDisplayAddress(fullAddress); // 최종 주소를 상태로 저장 input표시용
        setAddress(fullAddress); // 주소 검증용 state도 함께 갱신
      },
    }).open();
  };

  const validate = () => {
    const next = { name: "", phone: "", address: "" };
    const n = (name ?? "").trim();
    const a = (address ?? "").replace(/\u3000/g, " ").trim();

    if (!n) next.name = "수취인 이름을 입력해주세요.";
    else if (n.length > 10) next.name = "이름은 10자 이내여야 합니다.";

    if (!phoneInput) next.phone = "연락처를 입력해주세요.";
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
    navigate("/cart");
  };

  const onConfirmPay = async () => {
    const { isConfirmed } = await alertComfirm(
      "결제 진행",
      `선택한 결제수단: ${method}\n계속 진행할까요?`
    );
    if (!isConfirmed) return;

    try {
      setSubmitting(true);

      // 1) 주문 생성
      const order = await createOrder({
        recipient_name: name.trim(),
        recipient_phone: phoneInput,
        recipient_address: address.trim(),
        selected_items: selectedItemIds, // [int,...]
      });

      // 서버가 어떤 키로 id를 주는지에 따라 보정
      const orderId = order?.id ?? order?.order_id ?? order?.order?.id;
      if (!orderId) throw new Error("주문 번호를 확인할 수 없습니다.");

      // 2) 결제 생성 (대기)
      const payment = await createPayment({
        order_id: orderId,
        method,
      });

      await alertSuccess(
        "주문 접수",
        `주문번호 #${order.order_number}로 접수되었습니다.\n결제상태: ${
          payment.status
        }\n결제금액: ${Number(payment.total_price || 0).toLocaleString()}원`
      );
      // await alertSuccess("주문 접수", `주문번호로 접수되었습니다.`);
      // TODO: navigate(`/orders/${orderId}`);

        const res = await getCart();
        const items = Array.isArray(res[0]?.items) ? res[0].items : [];
        const mapped = items.map((item) => ({
          book: {
            id: item.product_id,
            name: item.product_name,
            category: item.product_category,
            author: item.product_author,
            publisher: item.product_publisher,
            price: Number(item.product_price),
            stock: item.product_stock,
            image_url: item.product_image,
          },
          quantity: item.quantity,
        }));
        setStoreCartItems(mapped); // ✅ 헤더 카운트 갱신 포인트

      const payload = {
        orderId,
        paymentId: payment?.id,
        method,
        amount: Number(payment?.total_price ?? subtotal ?? 0),
        when: new Date().toISOString(),
        items: buyProducts.map((p) => ({
          id: p.book.id,
          name: p.book.name,
          price: Number(p.book.price || 0),
          qty: Number(p.quantity || 0),
          image_url: p.book.image,
        })),
      };
      sessionStorage.setItem("last_payment_success", JSON.stringify(payload));
      navigate("/checkout/success", { replace: true, state: payload });
    } catch (e) {
      await alertError(
        "결제 실패",
        e.message || "주문/결제 처리 중 문제가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
      setOpenPayModal(false);
    }
  };

  return (
    <>
      <div className="base-container">
        <div className="checkout-container">
          {/* <Link to="/">
            <img className="checkout-logo" src="/new-logo.svg" alt="러블리 로고" />
          </Link> */}
          <div className="selected-products">
            <h1 className="selected-products-title">선택한 상품 목록</h1>

            <BookListRow
              books={booksForRow}
              // buttonActions={(book) => (
              //   <button onClick={() => console.log("삭제:", book.id)}>삭제</button>
              // )}
              // ✅ 여기서 qtyMap으로 안전하게 수량 뱃지 표시
              leftActions={(b) => (
                <span className="qty-badge">x{qtyMap.get(b.id) || 0}</span>
              )}
              // leftActions={(book) => (
              //   <input
              //     type="checkbox"
              //     value={book.id}
              //     defaultChecked={!book.isSoldOut}
              //   />
              // )}
            />

            <div className="order-summary">
              <div className="summary-row">
                <span>총 수량</span>
                <strong>{totalQty}개</strong>
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
              value={phoneFormat(phoneInput)}
              onChange={(e) => setPhoneInput(phoneFormat(e.target.value))}
              error={errors.phone}
              placeholder="010-1234-5678"
            />
            <FormGroup
              label="주소"
              value={displayAddress}
              onChange={(e) => {
                setDisplayAddress(e.target.value);
                setAddress(e.target.value);
              }}
            />
            <Button variant="secondary" size="md" onClick={handleAddressSearch}>
              주소 검색
            </Button>

            <div className="checkout-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={onClickPay}
                disabled={submitting || buyProducts.length === 0}
              >
                {submitting ? "처리 중..." : "결제하기"}
              </Button>
              <Button variant="secondary" size="lg" onClick={onClickCancel}>
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
                  disabled={submitting}
                >
                  {submitting ? "처리 중..." : "확인"}
                </Button>
              </>
            }
          >
            <div className="method-list">
              {METHODS.map((m) => (
                <Radio
                  key={m}
                  name="pay-method"
                  label={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                />
              ))}
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
