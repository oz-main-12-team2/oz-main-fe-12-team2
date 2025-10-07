import axios from "axios";

const kakaoApi = axios.create({
    baseURL: "https://dapi.kakao.com/v2/local",
    timeout: 10000,
});

kakaoApi.interceptors.request.use((config) => {
    config.headers.Authorization = `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`;
    return config;
});

export default kakaoApi;