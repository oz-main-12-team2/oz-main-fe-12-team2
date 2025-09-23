import api from "./axios";

// 일반 로그인
export const login = async (email, password) => {
  try {
    const res = await api.post("/user/login", { email, password });

    // success 여부 체크
    if (res.data.success === false) {
      // 서버가 알려준 에러 코드 메시지를 그대로 throw
      throw {
        message: res.data.error || "로그인에 실패했습니다.",
        code: res.data.code || "UNKNOWN_ERROR",
      };
    }

    return res.data; // 성공 시 그대로 리턴
  } catch (e) {
    if (e.response) {
      // 서버가 상태코드로 에러를 준 경우
      throw {
        message: e.response.data?.error || "서버 오류가 발생했습니다.",
        code: e.response.status,
      };
    }

    // 네트워크 자체 문제 (서버 연결 불가 등)
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
};

export const logout = async () => {
  try {
    await api.post("/user/logout");
  } catch (e) {
    console.error("로그아웃 실패:", e);
    throw e;
  }
};
