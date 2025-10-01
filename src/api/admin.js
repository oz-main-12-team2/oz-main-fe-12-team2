import api from "./axios";

// 관리자 유저 목록 조회 (/admin/users/)
export const getAdminUsers = async (page, page_size = 10) => {
  try {
    // const res = await api.get(`/admin/users/?page=${page}&size=${5}`);
    const res = await api.get(`/admin/users/`, {
      params: { page, page_size },
    });

    return res.data;
  } catch (e) {
    if (e.response) {
      // 서버에서 상태 코드로 에러를 내려준 경우
      throw {
        message:
          e.response.data?.error ||
          "유저 목록을 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    // 네트워크 문제 (서버 연결 불가 등)
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
};

// 특정 사용자 정보 수정, 활성화/비활성화 (PUT admin/users/:userid)
export async function toggleUserActive(userId, newState) {
  try {
    const res = await api.put(`/admin/users/${userId}/`, {
      is_active: newState,
    });

    return res.data;
  } catch (e) {
    if (e.response) {
      // 서버에서 상태 코드로 에러를 내려준 경우
      throw {
        message:
          e.response.data?.error || "유저 활성화 변경중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    // 네트워크 문제 (서버 연결 불가 등)
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 특정 사용자 삭제 (DELETE /admin/users/:userId/)
export async function deleteUser(userId) {
  try {
    const res = await api.delete(`/admin/users/${userId}/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "회원 삭제 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 주문 목록 조회 (GET /admin/orders/)
export async function getOrders({ page = 1, size = 20, ordering } = {}) {
  try {
    const params = new URLSearchParams();

    // 필수 파라미터
    params.append("page", page);
    params.append("page_size", size);

    // 선택적 파라미터 (정렬)
    if (ordering) {
      params.append("ordering", ordering);
    }

    const res = await api.get(`/admin/orders/?${params.toString()}`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "주문 목록을 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 특정 주문 상세 조회 (GET /admin/orders/:orderId/)
export async function getOrderDetail(orderId) {
  try {
    const res = await api.get(`/admin/orders/${orderId}/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "주문 상세 정보를 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 주문 상태/배송정보 수정 (PUT /admin/orders/:orderId/)
export async function updateOrder(orderId, payload) {
  try {
    const res = await api.put(`/admin/orders/${orderId}/`, payload);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error || "주문 정보 수정 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 주문 삭제 (DELETE /admin/orders/:id/)
export async function deleteOrder(orderId) {
  try {
    const res = await api.delete(`/admin/orders/${orderId}/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "주문 삭제 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 상품 등록(POST /admin/products/create/)
export async function createProduct(payload) {
  try {
    const formData = new FormData();

    // 텍스트 데이터 추가
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("author", payload.author);
    formData.append("publisher", payload.publisher);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    formData.append("category", payload.category);

    // 이미지 파일이 있을 경우 추가
    if (payload.imageFile) {
      formData.append("image", payload.imageFile);
    }

    const res = await api.post(`/admin/products/create/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "상품 등록 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 상품 삭제 (DELETE /admin/products/:productId/)
export async function deleteProduct(productId) {
  try {
    const res = await api.delete(`/admin/products/${productId}/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "상품 삭제 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 상품 수정 (PUT /admin/products/:productId/)
export async function updateProduct(productId, payload) {
  try {
    const formData = new FormData();

    // 텍스트 데이터 추가
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("author", payload.author);
    formData.append("publisher", payload.publisher);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    formData.append("category", payload.category);

    // 이미지 파일이 있을 경우 추가
    if (payload.imageFile) {
      formData.append("image", payload.imageFile);
    }

    const res = await api.put(`/admin/products/${productId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "상품 수정 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}

// 대시보드 통계 조회 (GET /admin/stats/dashboard/)
export async function getDashboardStats() {
  try {
    const res = await api.get(`/admin/stats/dashboard/`);
    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message:
          e.response.data?.error ||
          "대시보드 데이터를 불러오는 중 오류가 발생했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
}
