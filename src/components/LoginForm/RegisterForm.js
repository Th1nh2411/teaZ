import styles from './LoginForm.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { onlyNumber } from '../../utils/format';
import OtpInput from 'react-otp-input';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
const cx = classNames.bind(styles);

function RegisterForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [state, dispatch] = useContext(StoreContext);
    const postRegister = async () => {
        const results = await authService.register(phone, password, name);
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Đăng kí thành công',
                    title: 'Đăng kí',
                }),
            );
            onClickChangeForm();
        }
    };
    const generateCaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
                callback: (response) => {},
            },
            authentication,
        );
    };
    const sendOTP = (e) => {
        e.preventDefault();
        generateCaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
            })
            .catch((error) => {
                console.log(error);
            });
        setStep(2);
    };
    const ValidateOtp = (e) => {
        e.preventDefault();
        if (otp === null) return;
        postRegister();
    };
    const handleChangePhoneValue = (e) => {
        // if (onlyNumber(e.target.value)) {
        setPhoneNumber(e.target.value);
        // }
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
    };
    return (
        <form onSubmit={step === 1 ? sendOTP : ValidateOtp}>
            {step === 1 ? (
                <>
                    <Input
                        onChange={handleChangePhoneValue}
                        value={phone}
                        title="Số điện thoại"
                        errorMessage={'Vui lòng nhập số điện thoại'}
                        errorCondition={password.length === 10 && password.length !== 0}
                    />
                    <Input onChange={(e) => setName(e.target.value)} value={name} type="text" title="Tên người dùng" />
                    <Input
                        onChange={handleChangePasswordValue}
                        value={password}
                        title="Mật khẩu"
                        type="password"
                        errorMessage={'Mật khẩu phải lớn hơn 6 kí tự'}
                        errorCondition={password.length < 6 && password.length !== 0}
                    />
                    <Input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        type="password"
                        title="Xác nhận mật khẩu"
                        errorMessage="Xác nhận không trùng với mật khẩu trên"
                        errorCondition={confirmPassword !== password && confirmPassword !== ''}
                    />
                </>
            ) : (
                <OtpInput
                    containerStyle={{ margin: '10px 0 20px' }}
                    inputStyle={{
                        textAlign: 'center',
                        border: '1px solid',
                        width: '40px',
                        height: '40px',
                        margin: '0 5px',
                    }}
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                ></OtpInput>
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? 'Tạo tài khoản' : 'Xác thực mã OTP'}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default RegisterForm;
