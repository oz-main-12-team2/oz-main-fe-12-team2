// import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import api from "../api/axios";
import useUserStore from "../stores/userStore";

function AdminProtectedRoute({ children }) {
  const user = useUserStore((state) => state.user);

  // user가 없거나 is_admin이 false면 로그인 페이지로 이동
  if (!user || !user.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;

  /*
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await api.get("/user/me");

        if (res.data.is_admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("인증 실패 : ", e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);
  

  if (!isAdmin) {
    // 관리자 아니면 로그인 페이지로 리다이렉트
    return <Navigate to="/admin/login" replace />;
  }

  // 관리자면 children 렌더링
  return children;
  */
}

export default AdminProtectedRoute;
