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
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import { phoneFormat } from '../../utils/format';
import OTPInput from 'react-otp-input';

const cx = classNames.bind(styles);

function ForgotForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const [state, dispatch] = useContext(StoreContext);
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api

        step === 1 ? sendOTP() : step === 2 ? confirmOTP() : changePassword();
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
    const sendOTP = async () => {
        generateCaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phoneFormat(phone), appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Đã gửi mã OTP đến SĐT đăng ký',
                        title: 'Gửi SMS',
                    }),
                );
                setStep(2);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const confirmOTP = async () => {
        if (!otp) return;
        let confirmationResult = window.confirmationResult;
        confirmationResult
            .confirm(otp)
            .then((result) => {
                // User signed in successfully.
                setStep(3);
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Xác thực số điện thoại thành công',
                        title: 'Xác thực',
                    }),
                );
                // ...
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Nhập sai mã xác nhận',
                        type: 'error',
                    }),
                );
            });
    };
    const changePassword = async () => {
        const results = await authService.changePasswordForgot(phone, password, confirmPassword);
        if (results) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
            onClickChangeForm();
        } else {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
        }
    };

    return (
        <form onSubmit={handleSubmitLogin}>
            {step === 1 && (
                <Input
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                    value={phone}
                    title="Số điện thoại hoặc gmail"
                />
            )}
            {step === 2 && (
                <OTPInput
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
                ></OTPInput>
            )}
            {step === 3 && (
                <>
                    <Input
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
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
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? 'Gửi OTP đến gmail đăng ký' : step === 2 ? 'Xác nhận mã OTP' : 'Đổi mật khẩu'}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default ForgotForm;
