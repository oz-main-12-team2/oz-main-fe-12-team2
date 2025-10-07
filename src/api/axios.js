import axios from "axios";

const url = import.meta.env.VITE_API_URL;

// 인스턴스
export const api = axios.create({
  baseURL: url,
  timeout: 10000, // 요청 타임아웃 10초
  withCredentials: true, // 쿠키 자동 전송 (httpOnly)
});

// req 인터셉터
api.interceptors.request.use(
  (config) => {
    return config; // httpOnly 쿠키 방식은 js에서 토큰 직접 꺼낼 필요가 없음 = Authorization 헤더를 따로 붙일 필요 없음
  },
  (error) => Promise.reject(error)
);

// res 인터셉터: 401 처리 및 refresh token 재발급
api.interceptors.response.use(
  (response) => response, //정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 && 아직 재시도 안했으면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh token 요청, 서버에서 새 access token 발급
        await axios.post(`${url}/user/token/refresh/`, null, {
          withCredentials: true,
        });

        return api(originalRequest); // access token 갱신하고 원래 api 다시시도
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
