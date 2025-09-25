import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import "../styles/confirmemail.scss";
import { activateAccount } from "../api/user";
import { alertError, alertSuccess } from "../utils/alert";

function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = useMemo(() => searchParams.get("uid") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 파라미터 검증
    if (!uid || !token) {
      setStatus("error");
      setMessage("잘못된 인증 링크입니다. (uid 또는 token이 없습니다)");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        await activateAccount(uid, token);
        if (cancelled) return;

        setStatus("success");
        setMessage("본인 이메일 인증이 완료되었습니다!");
        await alertSuccess("이메일 인증 성공", "계정이 활성화되었습니다. 5초 후 홈으로 이동합니다.");

        // 5초 후 홈으로 이동
        const timer = setTimeout(() => navigate("/"), 5000);
        return () => clearTimeout(timer);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e.message || "이메일 인증에 실패했습니다.");
        await alertError("이메일 인증 실패", e.message || "링크가 만료되었거나 잘못된 요청입니다.");
      }
    })();

    return () => {
      cancelled = true;
    };

    // const timer = setTimeout(() => {
    //   navigate("/");
    // }, 5000);

    // // 컴포넌트 언마운트 시 타이머 정리
    // return () => clearTimeout(timer);
  }, [uid, token, navigate]);
  
  return (
    <>
      <Header />
      <div className="base-container">
        <div className="confirm-email-container">
          <div className="confirm-paper">
            {status === "loading" && (
              <>
                <p className="confirm-title">이메일 인증 중입니다…</p>
                <p className="confirm-desc">잠시만 기다려주세요.</p>
              </>
            )}

            {status === "success" && (
              <>
                <p className="confirm-title">본인 이메일 인증이 완료되었습니다!!</p>
                <p className="confirm-desc">5초 후 메인 페이지로 이동합니다.</p>
              </>
            )}

            {status === "error" && (
              <>
                <p className="confirm-title">이메일 인증에 실패했습니다.</p>
                <p className="confirm-desc" style={{ whiteSpace: "pre-line" }}>{message}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ConfirmEmail;