import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { getUserMe } from "../api/user";
import Loading from "../components/common/Loading";
import { alertError } from "../utils/alert";

function UserProtectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      try {
        if (!user) {
          const reloadUser = await getUserMe();
          setUser(reloadUser);
        }
      } catch (e) {
        console.error("사용자 확인 에러", e);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [user, setUser]);

  useEffect(() => {
    if (!loading && !user) {
      (async () => {
        await alertError(
          "로그인 필요",
          "회원전용 페이지입니다. 로그인 후 이용해 주세요"
        );
        navigate("/login", { replace: true });
      })();
    }
  }, [loading, user, navigate]);

  if (loading)
    return <Loading loadingText="접근 권한을 확인하고 있어요" size={60} />;
  if (!user) return;

  return children;
}

export default UserProtectedRoute;
