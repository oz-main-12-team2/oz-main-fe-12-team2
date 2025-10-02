import { useEffect, useMemo, useState, useCallback } from "react";
import Loading from "../common/Loading";
import "../../styles/orderlog.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import OrderTableHeader from "../orders/OrderTableHeader";
import Pagination from "../common/Pagination";

function OrderLog() {
  // const [data, setData] = useState({ count: 0, next: null, previous: null, results: [] });
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // DRF 기본 10 가정, 응답 보며 보정
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 페이지네이션이 필요하면 page 상태 사용
  // const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 10))),
    [totalCount, pageSize]
  );

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await api.get(`/orders/?page=${currentPage}`);
      // DRF 기본 응답: { count, next, previous, results }
      setOrders(Array.isArray(res.data?.results) ? res.data.results : []);
      setTotalCount(Number(res.data?.count ?? 0));

      // 페이지당 사이즈 보정 (마지막 페이지 등 가변 가능)
      const len = Array.isArray(res.data?.results) ? res.data.results.length : 0;
      if (len > 0) setPageSize(len);
    } catch (e) {
      console.error(e);
      setOrders([]);
      setError("주문 내역을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // const orders = useMemo(() => Array.isArray(data.results) ? data.results : [], [data]);

  if (isLoading) return <Loading loadingText="주문 목록 불러오는 중" size={40} />;

  return (
    <>
      <div className="myorders-page">
        <h1 className="myorders-title">주문 내역</h1>
        <div className="orders-meta">
          <span className="orders-total">총 {totalCount.toLocaleString()}건</span>
        </div>

        <OrderTableHeader />

        <div className="orders-list">
          {isLoading && <p className="orders-loading">불러오는 중…</p>}
          {error && <p className="orders-error">{error}</p>}

          {!isLoading && !error && orders.length === 0 && (
            <p className="orders-empty">주문 내역이 없습니다.</p>
          )}

          {!isLoading &&
            !error &&
            orders.map((order) => {
              const qty = (order.items || []).reduce(
                (acc, it) => acc + Number(it.quantity || 0),
                0
              );
              const total = Number(order.total_price || 0);
              return (
                <div key={order.id} className="order-row" onClick={() => navigate(`/orderlog/${order.id}`)}>
                  <span className="c c--id">{order.order_number}</span>
                  <span className="c c--date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="c c--recipient">{order.recipient_name}</span>
                  <span className="c c--qty">{qty}개</span>
                  <span className="c c--total">{total.toLocaleString()}원</span>
                  <span className="c c--status">{order.status}</span>
                  <span className="c c--chev">▶</span>
                </div>
              );
            })}
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}

export default OrderLog;