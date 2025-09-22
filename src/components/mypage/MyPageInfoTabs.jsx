import { NavLink } from "react-router-dom";

function MyPageInfoTabs() {
    const tabs = [
        { to: "/mypage", label: "회원정보 수정", end: true },
        { to: "/mypage/password", label: "비밀번호 수정" },
        { to: "/mypage/delete", label: "회원 탈퇴" },
    ];

    return (
        <>
            <nav className="mypage-tabs" role="tablist" aria-label="마이페이지 탭">
                {tabs.map((t) => (
                    <NavLink
                        key={t.to}
                        to={t.to}
                        role="tab"
                        end={t.end}
                        className={({ isActive }) =>
                            "mypage-tab" + (isActive ? " is-active" : "")
                        }
                    >
                        {t.label}
                    </NavLink>
                ))}
            </nav>
        </>
    )
}

export default MyPageInfoTabs;