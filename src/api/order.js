import api from "./axios";

// 주문 생성
export const createOrder = async ({ recipient_name, recipient_phone, recipient_address, selected_items }) => {
  try {
    const res = await api.post("/orders/", {
      recipient_name,
      recipient_phone,
      recipient_address,
      selected_items, // [number, ...]
    });
    return res.data; // 서버가 그대로 반환 (선택 아이템 echo 등)
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const k in data) {
        msgs.push(Array.isArray(data[k]) ? data[k].join(", ") : String(data[k]));
      }
      throw new Error(msgs.join("\n") || "주문 생성에 실패했습니다.");
    }
    throw new Error(e.message || "주문 생성 중 오류가 발생했습니다.");
  }
};

// 결제 생성
export const createPayment = async ({ order_id, method, status = "대기" }) => {
  try {
    const res = await api.post("/payments/", { order_id, method, status });
    return res.data; // { id, order_id, method, total_price, status, created_at }
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const k in data) {
        msgs.push(Array.isArray(data[k]) ? data[k].join(", ") : String(data[k]));
      }
      throw new Error(msgs.join("\n") || "결제 생성에 실패했습니다.");
    }
    throw new Error(e.message || "결제 생성 중 오류가 발생했습니다.");
  }
};

// 주문 조회
export const fetchOrders = async (params = {}) => {
  try {
    // 서버가 DRF pagination이면 page, page_size 등 필요시 params로 전달 가능
    const res = await api.get("/orders/", { params });
    return res.data; // { count, next, previous, results: [...] }
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const k in data) {
        msgs.push(Array.isArray(data[k]) ? data[k].join(", ") : String(data[k]));
      }
      throw new Error(msgs.join("\n") || "주문 목록을 불러오지 못했습니다.");
    }
    throw new Error(e.message || "주문 목록 조회 중 오류가 발생했습니다.");
  }
};