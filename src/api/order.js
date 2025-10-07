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
export const createPayment = async ({ order_id, method }) => {
  try {
    const res = await api.post("/payments/", { order_id, method });
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
export const fetchOrders = async ({ page = 1, page_size = 20 }) => {
  try {
    // 서버가 DRF pagination이면 page, page_size 등 필요시 params로 전달 가능
    const res = await api.get("/orders/", { params: {page, page_size} });
    // return res.data; // { count, next, previous, results: [...] }

    const data = res.data || {};
    const count = Number(data.count ?? 0);
    const results = Array.isArray(data.results) ? data.results : [];

    // ✅ 여기서 총 페이지 수까지 계산해서 넘겨줌
    const total_pages = Math.max(1, Math.ceil(count / page_size));

    return {
      count,
      results,
      next: data.next ?? null,
      previous: data.previous ?? null,
      page,           // 현재 페이지(요청 기준)
      page_size,      // 사용한 페이지 크기(고정)
      total_pages,    // 화면에서 바로 사용
    };
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

// 세부 주문 조회
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/${id}/`);
  return res.data;
};

// 결제 조회
export const fetchPayments = async (params = {}) => {
  try {
    const res = await api.get("/payments/my/", { params });
    // DRF 표준: { count, next, previous, results }
    return res.data;
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const k in data) {
        msgs.push(Array.isArray(data[k]) ? data[k].join(", ") : String(data[k]));
      }
      throw new Error(msgs.join("\n") || "결제 내역을 불러오지 못했습니다.");
    }
    throw new Error(e.message || "결제 목록 조회 중 오류가 발생했습니다.");
  }
};

// 세부 결제 조회
export const fetchPaymentById = async (id) => {
  const res = await api.get(`/payments/${id}`);
  return res.data;
};