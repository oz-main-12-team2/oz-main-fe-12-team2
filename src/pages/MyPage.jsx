import '../styles/mypage.scss'
import { Outlet } from 'react-router-dom';
import { MdOutlineMailOutline, MdOutlineHome } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function MyPage() {

    return (
        <>
            <div className="base-container">
                <Header />
                <div className='mypage-layout'>
                    
                    <aside className="mypage-sidebar">
                        <nav>
                            <p className='mypage-title'>마이페이지</p>
                            <div className='profile'>
                                <p className='mypage-greeting'>홍엽님 반갑습니다!</p>
                                {/* mypage-info의 경우 글자가 넘칠 경우 어떻게 할 지 */}
                                <div className='mypage-info'>
                                    <div className='mypage-email'>
                                        <MdOutlineMailOutline />
                                        <p>madwolves98@gmail.com</p>
                                    </div>
                                    <div className='mypage-address'>
                                        <MdOutlineHome />
                                        <p>서울시 마포구</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/mypage">
                                <span>나의정보</span>
                            </Link>
                            <Link to="/mypage/cart">
                                <span>장바구니</span>
                            </Link>
                        </nav>
                    </aside>
                    <div className='mypage-main'>
                        <Outlet />
                    </div>
                </div>
                <Footer />

                
            </div>
        </>
    )
}

export default MyPage