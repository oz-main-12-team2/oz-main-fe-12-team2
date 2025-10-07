import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import Pagination from "../common/Pagination";
import { fetchPayments, fetchOrderById } from "../../api/order";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../../styles/paymentlog.scss";

const NO_IMG = "/no-image.jpg";
const PAGE_SIZE = 20;

function PaymentLog() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 필터 상태
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // YYYY-MM-DD 포맷 변환
  const filters = useMemo(() => {
    const toYmd = (d) =>
      d
        ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10)
        : undefined;
    return {
      status: status === "all" ? undefined : status,
      created_at__gte: toYmd(startDate),
      created_at__lte: toYmd(endDate),
    };
  }, [status, startDate, endDate]);

  const orderCache = useMemo(() => new Map(), []);
  const getOrderWithCache = useCallback(
    async (orderId) => {
      if (!orderId) return null;
      if (orderCache.has(orderId)) return orderCache.get(orderId);
      const data = await fetchOrderById(orderId);
      orderCache.set(orderId, data);
      return data;
    },
    [orderCache]
  );

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const { results, count, total_pages } = await fetchPayments({
        page: currentPage,
        page_size: PAGE_SIZE,
        ...filters,
      });

      const enriched = await Promise.all(
        (results || []).map(async (p) => {
          try {
            const order = await getOrderWithCache(p.order_id);
            const firstItem = order?.items?.[0];
            const prod = firstItem?.product || {};
            const thumb = prod.image || prod.image_url || NO_IMG;
            const title = prod.name || "-";
            const extra =
              (order?.items?.length || 0) > 1
                ? ` 외 ${order.items.length - 1}개`
                : "";
            return { ...p, _thumb: thumb, _title: title, _itemsSummary: `${title}${extra}` };
          } catch {
            return { ...p, _thumb: NO_IMG, _title: "-", _itemsSummary: "-" };
          }
        })
      );

      setPayments(enriched);
      setTotalCount(count || 0);
      setTotalPages(total_pages || Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)));
    } catch (e) {
      setPayments([]);
      setError(e.message || "결제 내역을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, getOrderWithCache]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  if (isLoading) return <Loading loadingText="결제 내역 불러오는 중" size={40} />;

  return (
    <div className="mypayments-page">
      <h1 className="mypayments-title">결제 내역</h1>

      <div className="payments-meta">
        <span className="payments-total">총 {totalCount.toLocaleString()}건</span>

        <div className="payments-filters">
          {/* 상태 필터 */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체</option>
            <option value="대기">대기</option>
            <option value="성공">성공</option>
            <option value="실패">실패</option>
            <option value="취소">취소</option>
          </select>

          {/* 날짜 선택기 */}
          <div className="date-range">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setCurrentPage(1);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="시작일"
              dateFormat="yyyy-MM-dd"
              locale={ko}
              isClearable
              className="payments-datepicker"
            />
            <span className="tilde">~</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setCurrentPage(1);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="종료일"
              dateFormat="yyyy-MM-dd"
              locale={ko}
              isClearable
              className="payments-datepicker"
            />
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="paymentrow-header">
        <span className="h h--thumb" />
        <span className="h h--tid">결제번호</span>
        <span className="h h--method">수단</span>
        <span className="h h--status">상태</span>
        <span className="h h--total">금액</span>
        <span className="h h--date">일자</span>
        <span className="h h--items">상품</span>
      </div>

      {/* 리스트 */}
      <div className="payments-list">
        {error && <p className="payments-error">{error}</p>}
        {!error && payments.length === 0 && (
          <p className="payments-empty">결제 내역이 없습니다.</p>
        )}

        {!error &&
          payments.map((pay) => (
            <div
              key={pay.id}
              className="payment-row"
              onClick={() => navigate(`/payments/${pay.id}`)}
            >
              <span className="c c--thumb">
                <div className="thumb">
                  <img src={pay._thumb || NO_IMG} alt={pay._title || "상품"} />
                </div>
              </span>

              <span className="c c--tid">{pay.transaction_id || "-"}</span>
              <span className="c c--method">{pay.method}</span>
              <span className="c c--status">{pay.status}</span>
              <span className="c c--total">
                {(Number(pay.total_price) || 0).toLocaleString()}원
              </span>
              <span className="c c--date">
                {new Date(pay.created_at).toLocaleDateString()}
              </span>
              <span className="c c--items">{pay._itemsSummary}</span>
            </div>
          ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default PaymentLog;
