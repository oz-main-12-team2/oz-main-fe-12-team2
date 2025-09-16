import '../styles/findpassword.scss'
import FormGroup from '../components/common/FormGroup';
import Button from '../components/common/Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function FindPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const handleBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("이메일을 입력해주세요.");
        } else if (!emailRegex.test(email)) {
            setError("올바른 이메일 형식을 입력해주세요.");
        }
    };

    return (
        <>
            <div className='base-container'>
                <Link to="/">
                    <img className="find-password-logo" src="../../public/logo.svg" alt="러블리 로고" />
                </Link>

                <div className='find-password-container'>
                    <p className='find-password-title'>비밀번호 찾기</p>
                    <p className='find-password-desc'>회원정보에 등록된 이메일을 입력해주세요</p>

                    <FormGroup type="email" placeholder="이메일을 입력해주세요" value={email} onChange={handleChange} onBlur={handleBlur} error={error} />
                    <div className='find-password-submit'>
                        <Button variant='primary' size='lg' type='submit'>비밀번호 변경 이메일 받기</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FindPasswordPage;