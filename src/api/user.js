import api from "./axios";

// 일반 로그인
export const login = async (email, password) => {
  try {
    const res = await api.post("/user/login/", { email, password });

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

// 로그아웃
export const logout = async () => {
  try {
    await api.post("/user/logout/", { withCredentials: true });
  } catch (e) {
    console.error("로그아웃 실패 : ", e);
    throw e;
  }
};

// 현재 로그인한 유저 정보
export const getUserMe = async () => {
  try {
    const res = await api.get("/user/me/");

    return res.data;
  } catch (e) {
    if (e.response) {
      throw {
        message: e.response.data?.error || "사용자 정보를 불러오지 못했습니다.",
        code: e.response.status,
      };
    }
    throw {
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      code: "NETWORK_ERROR",
    };
  }
};

// 회원가입
export const register = async (
  email,
  name,
  password,
  password_confirm,
  address
) => {
  try {
    const res = await api.post("/user/register/", {
      email,
      name,
      password,
      password_confirm,
      address,
    });

    return res.data;
  } catch (e) {
    if (e.response && e.response.data) {
      const data = e.response.data;

      // ✅ 에러 객체 파싱
      let messages = [];
      for (const key in data) {
        if (Array.isArray(data[key])) {
          messages.push(`${key}: ${data[key].join(", ")}`);
        } else {
          messages.push(`${key}: ${data[key]}`);
        }
      }

      throw new Error(messages.join("\n")); // 줄바꿈으로 합치기
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

// 이메일 계정 활성화
export const activateAccount = async (uid, token) => {
  try {
    const res = await api.get("/user/activate/", {
      params: { uid, token },
    });
    return res.data; // { success: true, ... } 형태 가정
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;

      // DRF 필드형 에러 or 일반 메시지 모두 처리
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key])) msgs.push(`${data[key].join(", ")}`);
        else msgs.push(`${data[key]}`);
      }
      throw new Error(msgs.join("\n") || "이메일 인증에 실패했습니다.");
    }
    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "이메일 인증 중 오류가 발생했습니다.");
  }
};

// 비밀번호 재설정 메일 발송
export const requestPasswordReset = async (email) => {
  try {
    const res = await api.post("/user/password-reset/request/", { email });
    // 보통 200/202 반환. 메세지가 있다면 그대로 리턴
    return res.data ?? { success: true };
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data; // 예: { email: ["등록되지 않은 이메일입니다."] }
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key])) msgs.push(`${data[key].join(", ")}`);
        else msgs.push(`${String(data[key])}`);
      }
      const err = new Error(msgs.join("\n") || "메일 발송에 실패했습니다.");
      err.fieldErrors = data;
      throw err;
    }
    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "메일 발송 중 오류가 발생했습니다.");
  }
};

// 비밀번호 찾기 - 비밀번호 재설정
export const confirmPasswordReset = async ({
  uid,
  token,
  new_password,
  new_password_confirm,
}) => {
  try {
    const url = `/user/password-reset/confirm/?uid=${encodeURIComponent(
      uid
    )}&token=${encodeURIComponent(token)}`;
    const payload = {
      new_password,
      new_password_confirm,
      // 호환용(Djoser류): re_new_password도 함께 넣어두면 안전
      re_new_password: new_password_confirm,
    };

    const res = await api.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data ?? { success: true };
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data; // 예: { new_password: ["8자 이상이어야 합니다."] }
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key])) msgs.push(data[key].join(", "));
        else msgs.push(String(data[key]));
      }
      const err = new Error(
        msgs.join("\n") || "비밀번호 재설정에 실패했습니다."
      );
      err.fieldErrors = data; // 필드별 에러 전달
      throw err;
    }
    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "비밀번호 재설정 중 오류가 발생했습니다.");
  }
};

// 개인정보 수정
export const updateUserMe = async (name, address) => {
  try {
    const res = await api.put("/user/me/", { name, address });

    return res.data ?? { name, address };
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key]))
          msgs.push(`${key}: ${data[key].join(", ")}`);
        else msgs.push(`${key}: ${String(data[key])}`);
      }
      throw new Error(msgs.join("\n") || "개인정보 수정에 실패했습니다.");
    }

    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "개인정보 수정 중 오류가 발생했습니다.");
  }
};

// 비밀번호 수정
export const updatePassword = async (
  old_password,
  new_password,
  new_password_confirm
) => {
  try {
    const res = await api.put("/user/change-password/", {
      old_password,
      new_password,
      new_password_confirm,
    });

    return res.data ?? { old_password, new_password, new_password_confirm };
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key]))
          msgs.push(`${key}: ${data[key].join(", ")}`);
        else msgs.push(`${key}: ${String(data[key])}`);
      }
      const err = new Error(msgs.join("\n") || "비밀번호 수정에 실패했습니다.");
      err.fieldErrors = data;
      throw err;
    }

    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "비밀번호 수정 중 오류가 발생했습니다.");
  }
};

// 회원 탈퇴
export const deleteUserMe = async () => {
  try {
    const res = await api.delete("/user/me/delete/", { withCredentials: true });
    return res.data ?? { success: true };
  } catch (e) {
    if (e.response?.data) {
      const data = e.response.data;
      const msgs = [];
      for (const key in data) {
        if (Array.isArray(data[key]))
          msgs.push(`${key}: ${data[key].join(", ")}`);
        else msgs.push(`${key}: ${String(data[key])}`);
      }
      throw new Error(msgs.join("\n") || "회원 탈퇴에 실패했습니다.");
    }

    if (e.request)
      throw new Error("서버 응답이 없습니다. 네트워크를 확인해주세요.");
    throw new Error(e.message || "회원 탈퇴 중 오류가 발생했습니다.");
  }
};
