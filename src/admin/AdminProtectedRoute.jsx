import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { getUserMe } from "../api/user";
import Loading from "../components/common/Loading";

function AdminProtectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        if (user) {
          // 이미 zustand에 user가 있으면 그대로 사용
          setIsAdmin(user.is_admin);
        } else {
          // zustand 비어있으면 서버에 다시 확인
          const reloadUser = await getUserMe();
          setUser(reloadUser);
          setIsAdmin(reloadUser.is_admin);
        }
      } catch (e) {
        console.error("관리자 인증 실패 : ", e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user, setUser]);

  if (loading) return <Loading loadingText={"접근 권한을 확인하고 있어요"} size={100}/>;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
