import '../styles/signup.scss'
import FormGroup from "../components/common/FormGroup";
import Button from '../components/common/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from 'react-router-dom';

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 입력값
  const [email, setEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmInputPassword, setConfirmInputPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // 에러값
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  // 공통: 입력 시 해당 에러 초기화
  const handleEmailChange = (e) => { setEmail(e.target.value); if (emailError) setEmailError(""); };
  const handleNameChange = (e) => { setName(e.target.value); if (nameError) setNameError(""); };
  const handleAddressChange = (e) => { setAddress(e.target.value); if (addressError) setAddressError(""); };

  // 비번 입력 시: 빈값 에러 초기화 + 둘 다 값 있으면 불일치 검사, 아니면 match 에러 비움
  const handleInputPasswordChange = (e) => {
    const v = e.target.value;
    setInputPassword(v);
    if (passwordError) setPasswordError("");
    if (confirmPasswordError) setConfirmPasswordError("");
    if (v && confirmInputPassword) {
      setPasswordMatchError(v !== confirmInputPassword ? "입력한 비밀번호와 확인이 일치하지 않습니다." : "");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleConfirmInputPasswordChange = (e) => {
    const v = e.target.value;
    setConfirmInputPassword(v);
    if (confirmPasswordError) setConfirmPasswordError("");
    if (inputPassword && v) {
      setPasswordMatchError(inputPassword !== v ? "입력한 비밀번호와 확인이 일치하지 않습니다." : "");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSignUp = () => {
    // 초기화
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setAddressError("");
    setPasswordMatchError("");

    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일
    if (!email) { setEmailError("이메일을 입력해주세요."); hasError = true; }
    else if (!emailRegex.test(email)) { setEmailError("올바른 이메일 형식을 입력해주세요."); hasError = true; }

    // 비밀번호 빈값
    if (!inputPassword) { setPasswordError("비밀번호를 입력해주세요."); hasError = true; }
    if (!confirmInputPassword) { setConfirmPasswordError("비밀번호 확인을 입력해주세요."); hasError = true; }

    // 이름/주소
    if (!name) { setNameError("이름을 입력해주세요."); hasError = true; }
    if (!address) { setAddressError("주소를 입력해주세요."); hasError = true; }

    // 불일치 체크 (둘 다 값 있을 때만)
    if (!hasError && inputPassword && confirmInputPassword && inputPassword !== confirmInputPassword) {
      setPasswordMatchError("입력한 비밀번호와 확인이 일치하지 않습니다.");
      hasError = true;
    }

    if (hasError) return;

    // ✅ 모든 검증 통과 시: 회원가입 API 호출
    // await axios.post('/api/signup', { email, password: inputPassword, name, address });
  };
  
  return (
    <>
      <div className="base-container">
        <Link to="/">
          <img className="signup-logo" src="../../public/logo.svg" alt="러블리 로고" />
        </Link>

        <div className="signup-container">
          <FormGroup 
            type="email" 
            placeholder="이메일" 
            value={email}
            onChange={handleEmailChange}
          />

          {emailError && (
            <p className='field-error-message' role='alert'>
              {emailError}
            </p>
          )}

          <div className='password-input'>
            <FormGroup 
              type={showPassword ? "text" : "password"} 
              placeholder="비밀번호"
              value={inputPassword}
              onChange={handleInputPasswordChange}
            />
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

          {passwordError && (
            <p className='field-error-message' role='alert'>
              {passwordError}
            </p>
          )}

          {passwordMatchError && (
            <p className='field-error-message' role='alert'>
              {passwordMatchError}
            </p>
          )}

          <div className='confirm-password-input'>
            <FormGroup 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="비밀번호 확인"
              value={confirmInputPassword}
              onChange={handleConfirmInputPasswordChange}
            />
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

          {confirmPasswordError && (
            <p className='field-error-message' role='alert'>
              {confirmPasswordError}
            </p>
          )}

          {passwordMatchError && (
            <p className='field-error-message' role='alert'>
              {passwordMatchError}
            </p>
          )}

          <div className='name-input'>
            <FormGroup 
              type="text" 
              placeholder="이름" 
              value={name}
              onChange={handleNameChange}
            />
          </div>

          {nameError && (
            <p className='field-error-message' role='alert'>
              {nameError}
            </p>
          )}
          
          <div className='address-input'>
            <FormGroup 
              type="text" 
              placeholder="주소" 
              value={address}
              onChange={handleAddressChange}
            />
          </div>

          {addressError && (
            <p className='field-error-message' role='alert'>
              {addressError}
            </p>
          )}

          <div className='signup-options'>
            <div className='email-signup-button'>
              <Button variant='primary' size='lg' type='submit' onClick={handleSignUp}>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
