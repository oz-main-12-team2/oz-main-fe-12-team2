import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../../api/order";
import Loading from "../common/Loading";
import Button from "../common/Button";
import "../../styles/orderlog.scss";
import KRW from "../../utils/krw";
import { Link } from "react-router-dom";

function OrderLog() {
  const [data, setData] = useState({ count: 0, next: null, previous: null, results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");

  // 페이지네이션이 필요하면 page 상태 사용
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setErr("");
      try {
        const res = await fetchOrders(/* { page } */);
        setData(res || { count: 0, next: null, previous: null, results: [] });
      } catch (e) {
        setErr(e.message || "주문 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page]);

  const orders = useMemo(() => Array.isArray(data.results) ? data.results : [], [data]);

  if (isLoading) return <Loading loadingText="주문 목록 불러오는 중" size={40} />;

  return (
    <>
      <div className="myorders-page">
        <h1 className="myorders-title">주문 내역</h1>

        {err && <p className="myorders-error" role="alert">{err}</p>}

        {orders.length === 0 ? (
          <div className="myorders-empty">
            <p>주문 내역이 없습니다.</p>
            <Link to="/">메인으로 가기</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <section key={order.id} className="order-card">
                <header className="order-card-header">
                  <div className="order-meta">
                    <div className="order-number">
                      주문번호 <strong>#{order.order_number}</strong>
                    </div>
                    <div className="order-status">{order.status}</div>
                  </div>
                  <div className="order-dates">
                    <span className="created-at">
                      주문일 {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                </header>

                <div className="order-recipient">
                  <div><strong>수취인</strong> {order.recipient_name}</div>
                  <div><strong>연락처</strong> {order.recipient_phone}</div>
                  <div><strong>주소</strong> {order.recipient_address}</div>
                </div>

                <ul className="order-items">
                  {order.items?.map((it) => (
                    <li key={it.id} className="order-item">
                      <div className="item-thumb">
                        <img
                          src={it.product?.image || "/no-image.jpg"}
                          alt={it.product?.name || "상품"}
                          onError={(e) => { e.currentTarget.src = "/no-image.jpg"; }}
                        />
                      </div>

                      <div className="item-info">
                        <div className="item-title">{it.product?.name}</div>
                        <div className="item-sub">
                          {it.product?.author} · {it.product?.publisher} · {it.product?.category}
                        </div>

                        <div className="item-meta">
                          <span className="qty">수량 {it.quantity}개</span>
                          <span className="unit">단가 {KRW(it.unit_price)}원</span>
                          <span className="total">소계 {KRW(it.total_price)}원</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="order-card-footer">
                  <div className="order-total">
                    총 결제금액 <strong>{KRW(order.total_price)}원</strong>
                  </div>
                  {/* 필요 시 상세 페이지 라우팅 */}
                  {/* <Button size="sm" onClick={() => navigate(`/mypage/orders/${order.id}`)}>상세보기</Button> */}
                </footer>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default OrderLog;