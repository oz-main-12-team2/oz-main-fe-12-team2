import { useEffect, useState, useCallback } from "react";
import Loading from "../common/Loading";
import "../../styles/orderlog.scss";
import { useNavigate } from "react-router-dom";
import OrderTableHeader from "../orders/OrderTableHeader";
import Pagination from "../common/Pagination";
import { fetchOrders } from "../../api/order";

const NO_IMG = "/no-image.jpg";
const PAGE_SIZE = 20;

function OrderLog() {
  // const [data, setData] = useState({ count: 0, next: null, previous: null, results: [] });
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 페이지네이션이 필요하면 page 상태 사용
  // const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // const res = await fetchOrders({ page, page_size: 20, signal });
      const { results, count, total_pages } =
      await fetchOrders({ page: currentPage, page_size: PAGE_SIZE });
      
      setOrders(results);
      setTotalCount(count);
      setTotalPages(total_pages);
    } catch (e) {
      if (e.name === "CanceledError") return;
      setOrders([]);
      setError(e.message || "주문 내역을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // const orders = useMemo(() => Array.isArray(data.results) ? data.results : [], [data]);

  if (isLoading) return <Loading loadingText="주문 목록 불러오는 중" size={40} />;

  return (
    <>
      <div className="myorders-page">
        <p className="myorders-title">주문내역</p>
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

          {!error &&
            orders.map((order) => {
              const qty = (order.items || []).reduce(
                (acc, it) => acc + Number(it.quantity || 0),
                0
              );
              const total = Number(order.total_price || 0);

              const firstItem = order.items?.[0];
              const prod = firstItem?.product || {};
              const thumb = prod.image || prod.image_url || NO_IMG;
              const title = prod.name || "-";
              const extra =
                (order.items?.length || 0) > 1
                  ? ` 외 ${order.items.length - 1}개`
                  : "";
              
              return (
                <div
                  key={order.id}
                  className="order-row"
                  onClick={() => navigate(`/orderlog/${order.id}`)}
                >
                  <span className="c c--thumb">
                    <div className="thumb">
                      <img src={thumb || NO_IMG} alt={title} />
                    </div>
                  </span>

                  <span className="c c--id">{order.order_number}</span>
                  <span className="c c--date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="c c--recipient">{order.recipient_name}</span>
                  <span className="c c--qty">{qty}개</span>
                  <span className="c c--total">{total.toLocaleString()}원</span>
                  <span className="c c--status">{order.status}</span>
                  <span className="c c--items">{title}{extra}</span>
                </div>
              )
            })
          }
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