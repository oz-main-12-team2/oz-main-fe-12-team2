import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../common/Loading";
import Button from "../common/Button";
import NoImage from "/no-image.jpg"
import "../../styles/orderdetail.scss";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${id}/`);
        setOrder(res.data);
      } catch (e) {
        console.error("주문 상세 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading loadingText="주문 상세 불러오는 중..." size={40} />;
  if (!order) return <p>주문 정보를 찾을 수 없습니다.</p>;

  // ✅ 소계 합계 계산
  const subtotal = order.items.reduce(
    (acc, item) => acc + Number(item.total_price || 0),
    0
  );

  return (
    <div className="order-detail">
      <h1>주문 상세 #{order.order_number}</h1>

      <section className="order-items">
        <h2>주문 상품</h2>

        <ul>
          {order.items.map((item) => (
            <li key={item.id} className="order-item">
              <img src={item.product.image ? item.product.image : NoImage} alt={item.product.name} />
              <div className="info">
                <h3>{item.product.name}</h3>
                <p>{item.product.author} · {item.product.publisher}</p>
                <p>단가 {Number(item.unit_price).toLocaleString()}원 × {item.quantity}</p>
                <p>소계 {Number(item.total_price).toLocaleString()}원</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="order-summary">
          <strong>합계: {subtotal.toLocaleString()}원</strong>
        </div>
      </section>
      
      <div className="go-back">
          <Button
            onClick={() => navigate("/orderlog")}
          >
            뒤로가기
          </Button>
      </div>
      
    </div>
  )
}