import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import "../styles/confirmemail.scss";

function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <>
      <Header />
      <div className="base-container">
        <div className="confirm-email-container">
          <div className="confirm-paper">
            <p className="confirm-title">본인 이메일 인증이 완료되었습니다!!</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ConfirmEmail;