import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/paymentsuccess.scss";

const KRW = (n) => Number(n || 0).toLocaleString("ko-KR");

export default function PaymentSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  console.log(state);
  // state 우선 → 없으면 sessionStorage에서 백업 읽기
  useEffect(() => {
    if (state && typeof state === "object") {
      setData(state);
      return;
    }
    const raw = sessionStorage.getItem("last_payment_success");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, [state]);

  const subtotal = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.reduce(
      (acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0),
      0
    );
  }, [data]);

  if (!data) {
    return (
      <>
        <div className="success-container">
          <h1>결제가 완료되었습니다.</h1>
          <p className="dim">주문 정보가 확인되지 않아 홈으로 이동합니다.</p>
          <div className="actions">
            <Button
              variant="primary"
              onClick={() => navigate("/", { replace: true })}
            >
              홈으로
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="base-container success-container">
        <div className="success-head">
          <h1>결제가 완료되었습니다 🎉</h1>
          <p className="dim">
            주문번호 <b>#{data.orderId ?? "-"}</b> / 결제수단{" "}
            {data.method ?? "-"} / 결제일{" "}
            {data.when ? new Date(data.when).toLocaleString() : "-"}
          </p>
        </div>

        <div className="summary-card">
          <div className="summary-row">
            <span>주문번호</span>
            <strong>#{data.orderId ?? "-"}</strong>
          </div>
          <div className="summary-row">
            <span>결제수단</span>
            <strong>{data.method ?? "-"}</strong>
          </div>
          <div className="summary-row">
            <span>상품 합계</span>
            <strong>{KRW(subtotal)}원</strong>
          </div>
          <div className="summary-row total">
            <span>결제 금액</span>
            <strong>{KRW(data.amount ?? subtotal)}원</strong>
          </div>
        </div>

        {!!(data.items && data.items.length) && (
          <div className="items">
            {data.items.map((it) => (
              <div key={it.id} className="item">
                <div className="thumb">
                  <img
                    src={it.image_url || "/no-image.jpg"}
                    onError={(e) => (e.currentTarget.src = "/no-image.jpg")}
                    alt={it.name}
                  />
                </div>
                <div className="meta">
                  <div className="name">{it.name}</div>
                  <div className="sub">
                    수량 x{it.qty} · {KRW(it.price)}원
                  </div>
                </div>
                <div className="line-total">{KRW(it.price * it.qty)}원</div>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <Link to="/orderlog">
            <Button variant="primary" size="md">
              주문내역 보기
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="md">
              계속 쇼핑하기
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
