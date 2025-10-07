import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById, fetchPaymentById } from "../../api/order";
import Button from "../common/Button";
import Loading from "../common/Loading";
import "../../styles/paymentdetail.scss";

function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const paymentRes = await fetchPaymentById(id);
        console.log(paymentRes);
        setPayment(paymentRes);

        if (paymentRes?.order_id) {
          const orderRes = await fetchOrderById(paymentRes.order_id);
          setOrder(orderRes);
        }
      } catch (e) {
        setError(e.message || "결제 상세를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <Loading loadingText="결제 내역 불러오는 중" size={40} />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="payment-detail">
      <h1 className="detail-title">결제 상세 내역</h1>

      {/* 결제 정보 */}
      {payment && (
        <section className="receipt-section">
          <h2>결제 정보</h2>
          <ul>
            <li><strong>결제번호:</strong> {payment.transaction_id}</li>
            <li><strong>주문번호:</strong> {payment.order_id}</li>
            <li><strong>결제수단:</strong> {payment.method}</li>
            <li><strong>결제상태:</strong> {payment.status}</li>
            <li><strong>결제금액:</strong> {Number(payment.total_price).toLocaleString()}원</li>
            <li><strong>결제일시:</strong> {new Date(payment.created_at).toLocaleString()}</li>
          </ul>
        </section>
      )}

      {/* 주문 정보 */}
      {order && (
        <section className="receipt-section">
          <h2>주문 정보</h2>
          <ul>
            <li><strong>주문번호:</strong> {order.order_number}</li>
            <li><strong>수취인:</strong> {order.recipient_name}</li>
            <li><strong>주소:</strong> {order.recipient_address}</li>
            <li><strong>전화번호:</strong> {order.recipient_phone}</li>
            <li><strong>주문상태:</strong> {order.status}</li>
          </ul>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.product?.image || "/no-image.jpg"}
                  alt={item.product?.name || ""}
                />
                <div className="item-info">
                  <p className="name">{item.product?.name}</p>
                  <p className="qty">수량: {item.quantity}개</p>
                  <p className="price">
                    {Number(item.total_price).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="button-group">
        <Button onClick={() => navigate(`/orderlog/${order.id}`)}>
          주문 상세 보기
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          목록으로 돌아가기
        </Button>
      </div>
    </div>
  )
}

export default PaymentDetail;