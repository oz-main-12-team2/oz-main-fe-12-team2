import api from "./axios";

// 상품 목록 조회
export async function getProducts({ page = 1, size = 20, ordering } = {}) {
  try {
    const params = new URLSearchParams();

    // 필수 파라미터
    params.append("page", page);
    params.append("page_size", size);

    // 선택적 파라미터 (정렬)
    if (ordering) {
      params.append("ordering", ordering);
    }

    const res = await api.get(`/products/?${params.toString()}`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "상품 목록을 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}