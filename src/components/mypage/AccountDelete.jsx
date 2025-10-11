import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { getUserMe, deleteUserMe } from "../../api/user";
import { alertComfirm, alertSuccess, alertError } from "../../utils/alert";
import Loading from "../common/Loading";

function AccountDelete() {
  const navigate = useNavigate();

  // 유저 정보 상태
  const [user, setUser] = useState({ email: "", name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const me = await getUserMe();
        if (!ignore) setUser({ email: me.email, name: me.name });
      } catch (e) {
        if (!ignore) {
          await alertError("불러오기 실패", e.message || "사용자 정보를 불러오지 못했습니다.");
          navigate("/mypage");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleDelete = async () => {
    const result = await alertComfirm(
      "회원 탈퇴",
      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);
      await deleteUserMe();
      await alertSuccess("탈퇴 완료", "그동안 이용해주셔서 감사합니다.");
      navigate("/");
      window.location.reload();
    } catch (e) {
      await alertError("탈퇴 실패", e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Loading loadingText="계정 정보를 불러오는 중" size={44} />;

  return (
    <div className="delete-user-form">
      <h2>회원 탈퇴 안내</h2>
      <p className="delete-user-attribute"><strong>이메일</strong></p>
      <p className="delete-user-content">{user.email}</p>

      <p className="delete-user-attribute"><strong>이름</strong></p>
      <p className="delete-user-content">{user.name}</p>

      <p className="warning">
        회원탈퇴를 진행하면 해당 계정은 복구할 수 없습니다.
        <br />
        계속하시려면 아래의 <strong>탈퇴</strong> 버튼을 클릭해주세요.
      </p>
      
      <div className="account-delete-actions">
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "처리 중..." : "회원 탈퇴"}
        </Button>
      </div>
    </div>
  );
}

export default AccountDelete;
