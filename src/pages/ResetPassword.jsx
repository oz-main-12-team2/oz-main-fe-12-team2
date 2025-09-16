import '../styles/resetpassword.scss'
import FormGroup from '../components/common/FormGroup';
import Button from '../components/common/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from 'react-router-dom';

function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <>
            <div className='base-container'>
                <Link to="/">
                    <img className="reset-password-logo" src="../../public/logo.svg" alt="러블리 로고" />
                </Link>

                <div className='reset-password-continer'>
                    <p className='reset-password-title'>비밀번호 재설정</p>
                    <p className='reset-password-desc'>재설정할 비밀번호를 입력해주세요</p>

                    <div className='password-input'>
                        <FormGroup type={showPassword ? "text" : "password"} placeholder="비밀번호 입력" />
                        {showPassword ? (
                            <FaRegEye 
                                className='login-eye-icon'
                                role='button'
                                aria-label='비밀번호 가리기'
                                tabIndex={0}
                                onClick={() => setShowPassword(false)}
                            />
                        ): (
                            <FaRegEyeSlash 
                                className='login-eye-icon'
                                role='button'
                                aria-label='비밀번호 보기'
                                tabIndex={0}
                                onClick={() => setShowPassword(true)}
                            />
                        )}
                    </div>

                    <div className='confirm-password-input'>
                        <FormGroup type={showConfirmPassword ? "text" : "password"} placeholder="비밀번호 확인" />
                        {showConfirmPassword ? (
                            <FaRegEye 
                                className='confirm-login-eye-icon'
                                role='button'
                                aria-label='비밀번호 가리기'
                                tabIndex={0}
                                onClick={() => setShowConfirmPassword(false)}
                            />
                        ) : (
                            <FaRegEyeSlash 
                                className='confirm-login-eye-icon'
                                role='button'
                                aria-label='비밀번호 보기'
                                tabIndex={0}
                                onClick={() => setShowConfirmPassword(true)}
                            />
                        )}
                    </div>

                    <div className='confirm-reset-password'>
                        <Button variant='primary' size='lg' type='submit'>
                            비밀번호 재설정
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPasswordPage;