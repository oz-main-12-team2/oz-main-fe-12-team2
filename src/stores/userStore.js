import { create } from "zustand";
import api from "../api/axios";

const useUserStore = create((set) => ({
  user: null, // 로그인한 사용자 정보
  loading: false, // 로딩 상태
  error: null, // 에러 메시지

  getUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/user/me");
      set({ user: res.data, loading: false });
    } catch (e) {
      set({ user: null, loading: false, error: e.message });
    }
  },

  // 로그인 성공 시 사용자 상태 저장
  setUser: (userData) => set({ user: userData }),

  // 로딩 상태 변경
  setLoading: (loading) => set({ loading }),

  // 에러 상태 변경
  setError: (error) => set({ error }),

  // 로그아웃
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
