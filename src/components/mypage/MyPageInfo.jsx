import { Outlet, useLocation } from "react-router-dom";
import MyPageInfoTabs from "./MyPageInfoTabs";

function MyPageInfo() {
    const { pathname } = useLocation();

    return (
        <>
            <section className="mypage-section">
                <div className="mypage-section-header">
                    <h2 className="sr-only">마이페이지 설정</h2>
                    <MyPageInfoTabs />
                </div>

                <div
                    key={pathname} // 탭 전환 시 스크롤/포커스 제어가 필요하면 유지/조정
                    className="mypage-section-body"
                    role="tabpanel"
                >
                    <Outlet />
                </div>
            </section>
        </>
    )
}

export default MyPageInfo;