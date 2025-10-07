import { useRoutes } from "react-router-dom";

// 페이지 컴포넌트 불러오기
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUp";
import FindPasswordPage from "./pages/FindPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import MyPage from "./pages/MyPage";
import MyPageInfo from "./components/mypage/MyPageInfo";
import ProfileEdit from "./components/mypage/ProfileEdit";
import PasswordEdit from "./components/mypage/PasswordEdit";
import AccountDelete from "./components/mypage/AccountDelete";
import BookDetail from "./pages/BookDetail";
import adminRoutes from "./admin/adminRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import ConfirmEmail from "./pages/ConfirmEmail";
import useUserStore from "./stores/userStore";
import { useCallback, useEffect } from "react";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import useCartStore from "./stores/cartStore";
import { getCart } from "./api/cart";
import OrderLog from "./components/mypage/OrderLog";
import OrderDetailPage from "./components/mypage/OrderDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import Layout from "./pages/Layout";

function App() {
  const getUserFromStore = useUserStore((state) => state.getUser);
  const user = useUserStore((state) => state.user);
  const setCartCount = useCartStore((state) => state.setCartCount);

  const getUser = useCallback(async () => {
    try {
      await getUserFromStore();
    } catch (e) {
      console.error("사용자 정보 불러오기 실패:", e);
    }
  }, [getUserFromStore]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (typeof user === "undefined") return;

    (async () => {
      if (user) {
        try {
          const res = await getCart();
          const items = Array.isArray(res[0]?.items) ? res[0].items : [];
          setCartCount(items.length);
        } catch (e) {
          console.error("장바구니 불러오기 실패 : ", e);
          setCartCount(0); // 에러시 0으로 초기화
        }
      } else {
        setCartCount(0); // 로그아웃 0으로 초기화
      }
    })();
  }, [user, setCartCount]);

  // 라우트 배열
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />, // 공통 레이아웃
      children: [
        { index: true, element: <MainPage /> },
        { path: "book/:id", element: <BookDetail /> }, // 동적 라우트
        { path: "activate", element: <ConfirmEmail /> },
        {
          path: "mypage",
          element: <MyPage />,
          children: [
            {
              path: "",
              element: <MyPageInfo />,
              children: [
                { index: true, element: <ProfileEdit /> },
                { path: "password", element: <PasswordEdit /> },
                { path: "delete", element: <AccountDelete /> },
              ],
            },
          ],
        },
        { path: "search", element: <SearchPage /> },
        {
          path: "cart",
          element: <MyPage />, // 사이드바 유지
          children: [{ index: true, element: <CartPage /> }],
        },
        { path: "checkout", element: <CheckoutPage /> },
        { path: "/checkout/success", element: <PaymentSuccessPage /> },

        // 주문 내역
        {
          path: "/orderlog",
          element: <MyPage />,
          children: [{ index: true, element: <OrderLog /> }],
        },

        {
          path: "/orderlog/:id",
          element: <MyPage />,
          children: [{ index: true, element: <OrderDetailPage /> }],
        },
      ],
    },
    
    // 공통 레이아웃 적용 제외 (로그인, 회원가입, 패스워드 관련)
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/find-password", element: <FindPasswordPage /> },
    { path: "/password-reset/confirm", element: <ResetPasswordPage /> },    

    // 관리자라우트
    ...adminRoutes,
    
    { path: "*", element: <NotFoundPage /> }, //404낫파운드
  ]);

  return element;
}

export default App;