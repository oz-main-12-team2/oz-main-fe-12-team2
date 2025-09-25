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
    // httpOnly 쿠키 방식은 js에서 토큰 직접 꺼낼 필요가 없음 = Authorization 헤더를 따로 붙일 필요 없음
    return config;
  },
  (error) => Promise.reject(error)
);

// res 인터셉터: 401 처리 + 리프레시토큰 로직
let isRefreshing = false; // 토큰 갱신 요청 중인지 여부
let failedQueue = []; // 갱신 중 쌓이는 요청들을 저장

// 대기 중인 요청 처리 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 리턴
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러발생, 해당 요청이 아직 재시도 안 했을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 다른 refresh 요청이 진행 중이라면 큐에 넣고 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest)); // refresh 끝나면 다시 요청
      }

      // 현재 요청을 재시도 중으로 표시
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 리프레시토큰 요청 (서버에서 새 access token 발급)
        await axios.post(`${url}/user/token/refresh`, null, {
          withCredentials: true, // refresh 요청에도 쿠키 포함
        });
        processQueue(); // 대기 중인 요청들 재시작
        return api(originalRequest); // 원래 요청 다시 시도
      } catch (e) {
        // refresh 실패
        processQueue(e);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error); // 다른 에러는 그대로 전달
  }
);

export default api;