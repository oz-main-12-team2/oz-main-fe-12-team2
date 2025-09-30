import api from "./axios";

// 장바구니 조회 (GET /cart/)
export async function getCart({ page, ordering } = {}) {
  try {
    const params = new URLSearchParams();

    // 선택 파라미터
    if (page) params.append("page", page);

    if (ordering) params.append("ordering", ordering);

    const queryString = params.toString();
    const url = queryString ? `/cart/?${queryString}` : `/cart/`;

    const res = await api.get(url);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "장바구니를 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 장바구니 추가 (POST /cart/)
export async function addCart({ productId, quantity = 1 }) {
  try {
    const body = {
      product_id: productId,
      quantity,
    };

    const res = await api.post("/cart/items/", body);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "장바구니에 상품을 추가하는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 장바구니 아이템 수량 변경 (PUT /cart/items/{productId}/)
export async function updateCartItem(productId, quantity) {
  try {
    const body = { quantity };

    const res = await api.put(`/cart/items/${productId}/`, body);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "장바구니 수량 변경중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}