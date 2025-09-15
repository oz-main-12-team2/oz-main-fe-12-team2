import '../styles/loginpage.scss'
import FormGroup from '../components/common/FormGroup';
import Button from '../components/common/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import { Link } from 'react-router-dom';

import naverlogin from '../assets/btnG_complete_login.png';
import googlelogin from '../assets/web_neutral_sq_SI@4x.png';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="base-container">
            <img className="login-logo" src="../../public/logo.svg" alt="러블리 로고" />

            <div className='login-container'>
                <FormGroup type="email" placeholder="이메일" />
                <div className='password-input'>
                    <FormGroup type={showPassword ? "text" : "password"} placeholder="비밀번호" />
                    {showPassword ? (
                        <FaRegEye
                            className='login-eye-icon'
                            role='button'
                            aria-label='비밀번호 가리기'
                            tabIndex={0}
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <FaRegEyeSlash
                            className='login-eye-icon'
                            role='button'
                            aria-label='비밀번호 보기'
                            tabIndex={0}
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>

                <div className='login-account-options'>
                    <div className='login-button'>
                        <Button variant='primary' size='lg' type='submit'>
                            로그인
                        </Button>
                    </div>
                    <div className='account-options'>
                        <Link to="#">비밀번호 찾기</Link>
                        <Link to="/signup">회원가입</Link>
                    </div>
                </div>
                
                <h1>소셜로그인</h1>
                <div className='social-login'>
                    <Button className='naver-login'>
                        <img src={naverlogin} alt='네이버로그인' />
                    </Button>
                    <Button className='google-login'>
                        <img src={googlelogin} alt='구글로그인' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
