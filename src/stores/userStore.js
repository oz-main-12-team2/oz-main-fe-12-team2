import { create } from "zustand";
import { getUserMe } from "../api/user";

const useUserStore = create((set) => ({
  user: null, // 로그인한 유저정보

  // api로 getUserMe 가져오기 (재갱신 할떄)
  getUser: async () => {
    try {
      const userData = await getUserMe();
      set({ user: userData });
    } catch {
      set({ user: null });
    }
  },

  // 유저 상태 저장
  setUser: (userData) => set({ user: userData }),

  // 로그아웃
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
