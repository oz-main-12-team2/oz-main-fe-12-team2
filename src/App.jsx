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
import useUserStore from "./stores/userStore";
import { useEffect } from "react";

function App() {
  const { getUser } = useUserStore();

  useEffect(() => {
    getUser(); // 쿠키 기반 인증 자동 로그인 복구
  }, [getUser]);

  // 라우트 배열
  const element = useRoutes([
    { path: "/", element: <MainPage /> },
    { path: "/book/:id", element: <BookDetail /> }, // 동적 라우트
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/find-password", element: <FindPasswordPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    {
      path: "/mypage",
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
        // { path: "cart" element: <Cart /> }, // 장바구니 추가 예정
      ],
    },

    // 관리자라우트
    adminRoutes,
    // { path: "*", element: <NotFoundPage /> }, // 404낫파운드 추가 예정
  ]);

  return element;
}

export default App;
