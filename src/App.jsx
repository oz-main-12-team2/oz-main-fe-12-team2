import { useRoutes } from "react-router-dom";

// 페이지 컴포넌트 불러오기
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUp";
import adminRoutes from "./admin/adminRoutes";

function App() {
  // 라우트 배열
  const element = useRoutes([
    { path: "/", element: <MainPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },

    // 관리자라우트
    adminRoutes,
    // { path: "*", element: <NotFoundPage /> }, // 404낫파운드 추가 예정
  ]);

  return element;
}

export default App;
