import '../styles/signup.scss'
import FormGroup from "../components/common/FormGroup";
import Button from '../components/common/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from 'react-router-dom';

import naversignup from '../assets/btnG_signup.png';
import googlesignup from '../assets/web_neutral_sq_SU@4x.png';

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <div className="base-container">
        <img className="signup-logo" src="../../public/logo.svg" alt="러블리 로고" />

        <div className="signup-container">
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

          <div className='name-input'>
            <FormGroup type="text" placeholder="이름" />
          </div>
          
          <div className='address-input'>
            <FormGroup type="text" placeholder="주소" />
          </div>

          <div className='signup-options'>
            <div className='email-signup-button'>
              <Button variant='primary' size='lg' type='submit'>
                회원가입
              </Button>
            </div>

            <div className='divider'>
              <hr />
              <span>또는</span>
              <hr />
            </div>

            <div className='social-signup'>
              <Link to="#" className='naver-signup'>
                <img src={naversignup} alt='네이버 소셜 회원가입' />
              </Link>
              <Link to="#" className='google-signup'>
                <img src={googlesignup} alt='구글 소셜 회원가입' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
