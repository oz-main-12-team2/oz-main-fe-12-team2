import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { IoMdClose } from "react-icons/io";

function AccountDelete() {
    const navigate = useNavigate();

    // 표시용 사용자 정보 (API로 교체)
    const [profile, setProfile] = useState({
        email: "",
        username: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // 모달/삭제 상태
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let ignore = false;
        (async () => {
        try {
            setIsLoading(true);
            // TODO: 실제 API로 교체
            // const res = await fetch("/api/users/me");
            // const data = await res.json();
            const data = {
                email: "madwolves98@gmail.com",
                username: "홍엽",
            };
            if (!ignore) setProfile(data);
        } catch (e) {
            console.error(e);
            // TODO: 에러 토스트
        } finally {
            if (!ignore) setIsLoading(false);
        }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const onDelete = async () => {
        try {
            setIsDeleting(true);
            // TODO: 실제 API로 교체 (DELETE /api/users/me)
            // const res = await fetch("/api/users/me", { method: "DELETE" });
            // if (!res.ok) throw new Error("탈퇴 실패");
            await new Promise((r) => setTimeout(r, 600)); // 데모용

            // TODO: 토스트("탈퇴가 완료되었습니다.")
            setConfirmOpen(false);

            // 세션/토큰 정리 후 메인 등으로 이동
            // TODO: authStore.clear(); 등
            navigate("/", { replace: true });
        } catch (e) {
            console.error(e);
            // TODO: 에러 토스트/메시지 매핑
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="account-delete-loading">불러오는 중…</div>;
    }

    return (
        <div>
            <div className="delete-user-form">
                <p className="delete-user-attribute">이메일</p>
                <p className="delete-user-content">{profile.email}</p>

                <p className="delete-user-attribute">이름</p>
                <p className="delete-user-content">{profile.username}</p>

                <p className="warning">
                    회원탈퇴를 진행하면 해당 계정은 복구할 수 없습니다.
                </p>
                <p className="warning">
                    계속하실거면 탈퇴 버튼을 클릭해주세요.
                </p>

                <div className="account-delete-actions">
                    <Button
                        variant="danger"
                        onClick={() => setConfirmOpen(true)}
                    >
                        회원탈퇴
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/mypage", { replace: false })}
                    >
                        취소
                    </Button>
                </div>
            </div>

            {/* 최종 확인 모달 */}
            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={
                    <div className="modal-title">
                        <span className="edit-data-title">정말 탈퇴하시겠습니까?</span>
                    </div>
                }
                footer={
                    <>
                        <Button
                        variant="danger"
                        onClick={onDelete}
                        disabled={isDeleting}
                        >
                        {isDeleting ? "처리 중..." : "탈퇴"}
                        </Button>
                        <Button
                        variant="secondary"
                        onClick={() => setConfirmOpen(false)}
                        disabled={isDeleting}
                        >
                        취소
                        </Button>
                    </>
                }
            >
                <div className="account-delete-modal-body">
                    <p>
                        계정 <strong>{profile.email}</strong> 을(를) 탈퇴합니다.
                    </p>
                    <p className="warning">
                        이 작업은 되돌릴 수 없습니다. 계속 진행하시겠습니까?
                    </p>
                </div>
            </Modal>
        </div>
    );
}

export default AccountDelete;