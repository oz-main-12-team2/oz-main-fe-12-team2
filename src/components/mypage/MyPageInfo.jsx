import { Outlet, useLocation } from "react-router-dom";
import MyPageInfoTabs from "./MyPageInfoTabs";

function MyPageInfo() {
    const { pathname } = useLocation();

    return (
        <>
            <section className="mypage-section">
                <div className="mypage-section-header">
                    <p className="sr-only">계정설정</p>
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