import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/notfound.scss";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <img src="/logo.svg" alt="로고" className="notfound-logo" />

        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-sub-title">페이지를 찾을 수 없습니다</h2>
        <p className="notfound-info">
          찾으시는 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
          <br />
          홈으로 돌아가 다시 시작해보세요.
        </p>

        <Button onClick={handleGoHome} variant="primary" size="lg">
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
