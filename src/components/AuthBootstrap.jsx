import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useUserStore from "../stores/userStore";
import { isExpectingOAuth, clearExpectingOAuth, consumePostLoginRedirect } from "../utils/oauth";

function AuthBootstrap() {
  const { setUser, setLoading } = useUserStore();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      try {
        setLoading(true);
        // ✅ /user/me/ 한 번만 호출하면, 401 시 인터셉터가 자동 refresh → 재시도함.
        const { data } = await api.get("/user/me/");
        if (!alive) return;
        setUser(data);

        // 소셜 콜백 복귀였다면, 저장된 경로로 이동
        if (isExpectingOAuth()) {
          clearExpectingOAuth();
          const next = consumePostLoginRedirect();
          if (next && next !== loc.pathname) navigate(next, { replace: true });
        }
      } catch {
        // 최종적으로도 실패하면 비로그인 상태 유지
        if (!alive) return;
        setUser(null);
        clearExpectingOAuth();
      } finally {
        if (alive) setLoading(false);
      }
    }

    bootstrap();
    return () => { alive = false; };
  }, []);

  return null;
}

export default AuthBootstrap;