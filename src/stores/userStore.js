import { create } from "zustand";
import { getUserMe } from "../api/user";

const useUserStore = create((set) => ({
  user: null, // 로그인한 사용자 정보
  loading: false, // 로딩 상태
  error: null, // 에러 메시지
  justLoggedOut: false, // 방금 로그아웃 했는지 여부

  getUser: async () => {
    set({ loading: true, error: null });
    try {
      const userData = await getUserMe();
      set({ user: userData, loading: false, justLoggedOut: false });
    } catch (e) {
      set({ user: null, loading: false, error: e.message });
    }
  },
  // 로그인 성공 시 사용자 상태 저장


  setUser: (userData) => set({ user: userData, justLoggedOut: false }),
  
  // 로딩 상태 변경
  setLoading: (loading) => set({ loading }),

  // 에러 상태 변경
  setError: (error) => set({ error }),
    
  // 로그인 성공 시 사용자 상태 저장
  setUser: (userData) => set({ user: userData }),

  // 로딩 상태 변경
  setLoading: (loading) => set({ loading }),

  // 에러 상태 변경
  setError: (error) => set({ error }),

  // 로그아웃
  clearUser: () => set({ user: null, justLoggedOut: true }),
}));

export default useUserStore;