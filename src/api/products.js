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

    if (query) params.append("query", query); // 검색어 있으면 추ㅜ가

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
    //API res.data식으로 여기서 작업하기 스웨거서 정보를 확인하고 진행하기 ( 엔드포인트가 어디인지 + 받아오는 데이터가 무엇인지 ) 
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