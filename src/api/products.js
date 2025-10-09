import api from "./axios";

// 상품 목록 조회
export async function getProducts({
  page = 1,
  size = 20,
  ordering,
  query,
  category,
} = {}) {
  try {
    const params = new URLSearchParams();

    // 필수 파라미터
    params.append("page", page);
    params.append("page_size", size);

    // 선택적 파라미터 (정렬)
    if (ordering) {
      params.append("ordering", ordering);
    }

    if (query) params.append("query", query); // 검색어 있으면 추가

    if (category) {
      params.append("category", category); // 카테고리 추가
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

// cdh - 만들기 API( 특정 상품 1개 조회용 )
export const getProductItem = async (id) => {
  try {
    const res = await api.get(`/products/${id}/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "상품정보를 갖고오지 못했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
};

// 일간 판매량 기준 Top N 상품 목록 조회 (베스트셀러)
export async function getBestSellerProducts() {
  try {
    // '/api/stats/rankings/' 엔드포인트 호출
  const res = await api.get(`/stats/rankings/`);

    // 서버 응답이 배열 자체이거나 { rankings: [...] } 객체일 수 있으므로
    // MainPage.jsx에서 안전하게 처리할 수 있도록 응답을 반환합니다.
    // DRF의 경우 대부분 배열을 포함한 객체 형태이므로, 일반적으로는 res.data.rankings를 사용합니다.
    // 하지만 현재는 오류 해결을 위해 MainPage에서 처리하도록 res.data를 반환합니다.
    return res.data; 

  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "일간 베스트셀러 목록을 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}