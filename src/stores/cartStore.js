import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cartItems: [], // 전체 장바구니 상품 (API로 받아오는 것)
  cartCount: 0, //장바구니 개수

  // API 호출 후 장바구니 초기화
  setCartItems: (items) =>
    set({
      cartItems: items,
      cartCount: items.length,
    }),

  // api 호출 후 장바구니 개수 저장
  setCartCount: (count) => set({ cartCount: count }),

  // 장바구니에서 상품 제거
  removeItem: (id) =>
    set({ cartItems: get().cartItems.filter((i) => i.id !== id) }),

  // 수량 변경
  updateQuantity: (id, quantity) => {
    set({
      cartItems: get().cartItems.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    });
  },

  // 재고 있는 상품만 반환 (다음 구매하기에서 사용)
  inStockItems: () => get().cartItems.filter((item) => item.stock > 0),

  // 품절 상품만 반환 (장바구니 페이지에서 따로 보여주기)
  outOfStockItems: () => get().cartItems.filter((item) => item.stock === 0),
}));

export default useCartStore;
