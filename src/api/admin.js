import api from "./axios";

// 관리자 유저 목록 조회 (/admin/users/)
export const getAdminUsers = async () => {
  try {
    // const res = await api.get(`/admin/users/?page=${page}&size=${5}`);
    const res = await api.get(`/admin/users/`);

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

// 특정 사용자 정보 수정, 활성화/비활성화 (admin/users/:userid)
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
