import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cart";
import { alertError } from "../utils/alert";

function useBuyMove() {
  const navigate = useNavigate();

  async function navigateToCheckout(products) {
    try {
      // 최신 장바구니 또는 재고 정보 조회
      const res = await getCart();
      const latestItems = Array.isArray(res[0]?.items) ? res[0].items : [];

      // 재고 체크
      for (const product of products) {
        const latest = latestItems.find(
          (item) => item.product_id === product.book.id
        );

        if (!latest) {
          alertError(
            "상품 구매 오류",
            `${product.book.name} 상품 정보를 찾을 수 없습니다.`
          );
          return;
        }

        if (product.quantity > latest.product_stock) {
          alertError(
            "상품 재고 부족",
            `${product.book.name} 상품 재고가 부족합니다. 재고: ${latest.product_stock}`
          );
          return;
        }
      }

      // 이상 없으면 checkout 페이지로 이동
      navigate("/checkout", { state: { buyProducts: products } });
    } catch {
      alertError("상품 구매 오류", "재고 확인 중 문제가 발생했습니다.");
    }
  }

  return navigateToCheckout;
}

export default useBuyMove;
