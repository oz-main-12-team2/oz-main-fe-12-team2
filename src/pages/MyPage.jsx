import '../styles/mypage.scss'
import { MdOutlineMailOutline, MdOutlineHome } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Button from '../components/common/Button';
import { Link } from "react-router-dom"
import { useState } from 'react';
import Modal from '../components/common/Modal';
import FormGroup from '../components/common/FormGroup';

function MyPage() {
    const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
    const [deleteMemeberModalOpen, setDeleteMemberModalOpen] = useState(false);

    return (
        <>
            <div className='mypage-layout'>
                <aside className="mypage-sidebar">
                    <img className="mypage-logo" src="../../public/logo.svg" alt="러블리 로고" />
                    <nav>
                        <Link to="/mypage">
                            <span>나의정보</span>
                        </Link>
                        <Link to="/mypage/cart">
                            <span>장바구니</span>
                        </Link>
                    </nav>
                </aside>
                <div className="base-container">
                    <div className='mypage-content'>
                        <h1 className='mypage-title'>나의 정보</h1>
                        <p className='mypage-greeting'>홍엽님 반갑습니다!</p>

                        <div className='mypage-info'>
                            <div className='mypage-email'>
                                <MdOutlineMailOutline />
                                <span>madwolves98@gmail.com</span>
                            </div>
                            <div className='mypage-address'>
                                <MdOutlineHome />
                                <span>서울시 마포구</span>
                            </div>
                        </div>
                    </div>
                    

                    <div className='mypage-buttons'>
                        <Button
                            variant='primary'
                            onClick={() => setIsEditDataModalOpen(true)}
                        >
                            개인정보 수정
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => setIsEditPasswordModalOpen(true)}
                        >
                            비밀번호 수정
                        </Button>
                        <Button
                            variant='secondary'
                            onClick={() => setDeleteMemberModalOpen(true)}
                        >
                            회원탈퇴
                        </Button>
                    </div>
                </div>

                {/* 개인정보 수정 모달 */}
                <Modal
                    isOpen={isEditDataModalOpen}
                    onClose={() => setIsEditDataModalOpen(false)}
                    title={
                        <>
                            <span className='edit-data-title'>정보 수정</span>
                            <div 
                                className='edit-data-close'
                                role="button"
                                aria-label="닫기"
                                onClick={() => setIsEditDataModalOpen(false)}
                            >
                                <IoMdClose />
                            </div>
                        </>
                    }
                    footer={
                        <>
                            <Button>
                                수정하기
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => setIsEditDataModalOpen(false)}
                            >
                                취소
                            </Button>
                        </>
                    }
                >
                    <div className='edit-data-form'>
                        <div className='edit-data-email'>
                            <FormGroup type="email" label="이메일" />
                        </div>
                        <div className='edit-data-username'>
                            <FormGroup type="text" label="유저이름" />
                        </div>
                        <div className='edit-data-address'>
                            <FormGroup type="text" label="주소" />
                        </div>
                    </div>
                    <hr />
                </Modal>

                {/* 비밀번호 수정 모달 */}
                <Modal
                    isOpen={isEditPasswordModalOpen}
                    onClose={() => setIsEditPasswordModalOpen(false)}
                    title={
                        <>
                            <span className='edit-data-title'>비밀번호 수정</span>
                            <div 
                                className='edit-data-close'
                                role="button"
                                aria-label="닫기"
                                onClick={() => setIsEditPasswordModalOpen(false)}
                            >
                                <IoMdClose />
                            </div>
                        </>
                    }
                    footer={
                        <>
                            <Button>
                                수정하기
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => setIsEditPasswordModalOpen(false)}
                            >
                                취소
                            </Button>
                        </>
                    }
                >
                    <div className='edit-password-form'>
                        <div className='edit-password'>
                            <FormGroup type="password" label="비밀번호" />
                        </div>
                    </div>
                    <hr />
                </Modal>
                
                {/* 회원탈퇴 모달 */}
                <Modal
                    isOpen={deleteMemeberModalOpen}
                    onClose={() => setDeleteMemberModalOpen(false)}
                    title={
                        <>
                            <span className='edit-data-title'>회원탈퇴</span>
                            <div 
                                className='edit-data-close'
                                role="button"
                                aria-label="닫기"
                                onClick={() => setDeleteMemberModalOpen(false)}
                            >
                                <IoMdClose />
                            </div>
                        </>
                    }
                    footer={
                        <>
                            <Button
                                variant='danger'
                            >
                                탈퇴
                            </Button>
                            <Button
                                variant='secondary'
                                onClick={() => setDeleteMemberModalOpen(false)}
                            >
                                취소
                            </Button>
                        </>
                    }
                >
                    <div className='delete-user-form'>
                        <p className='delete-user-attribute'>이메일</p>
                        <p className='delete-user-content'>madwolves98@gmail.com</p>
                        <p className='delete-user-attribute'>이름</p>
                        <p className='delete-user-content'>홍엽</p>
                        <p className='warning'>
                            회원탈퇴하시면 해당 계정을 더 이상 복구할 수 없습니다.
                            <br />
                            계속하실거면 탈퇴 버튼을 클릭해주세요.
                        </p>
                    </div>
                    
                    <hr />
                </Modal>
            </div>
            
        </>
    )
}

export default MyPage