import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cart";
import { alertError } from "../utils/alert";

function useBuyMove() {
  const navigate = useNavigate();

  const navigateToCheckout = async (products, flag) => {
    const directStockCheck = products[0].book.stock;

    if (directStockCheck === 0) {
      alertError(
        "상품 재고 부족",
        `${products[0].book.name} 상품 재고가 부족합니다. 재고: ${directStockCheck}`
      );
      return;
    }
    
    if (flag === "direct") {
      navigate("/checkout", {
        state: { buyProducts: products, path: "direct" },
      });
      return;
    }

    try {
      // 최신 장바구니 또는 재고 정보 조회
      const res = await getCart();
      const latestItems = Array.isArray(res[0]?.items) ? res[0].items : [];

      // 재고 체크
      products.forEach((product) => {
        const latest = latestItems.find(
          (item) => item.product_id === product.book.id
        );

        if (product.quantity > latest.product_stock) {
          alertError(
            "상품 재고 부족",
            `${product.book.name} 상품 재고가 부족합니다. 재고: ${latest.product_stock}`
          );
          return;
        }
      });

      // 이상 없으면 checkout 페이지로 이동
      navigate("/checkout", { state: { buyProducts: products, path: "cart" } });
    } catch {
      alertError("상품 구매 오류", "재고 확인 중 문제가 발생했습니다.");
    }
  };

  return navigateToCheckout;
}

export default useBuyMove;
