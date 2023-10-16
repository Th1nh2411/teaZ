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
import { onlyNumber, onlyPhoneNumVN, phoneFormat } from '../../utils/format';
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
    const postRegister = async (e) => {
        e.preventDefault();
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
    const ValidateOTP = async (e) => {
        e.preventDefault();
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
    const handleChangePhoneValue = (e) => {
        if (onlyNumber(e.target.value)) {
            setPhoneNumber(e.target.value);
        }
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    return (
        <form onSubmit={step === 1 ? sendOTP : step === 2 ? ValidateOTP : postRegister}>
            {step === 1 ? (
                <Input
                    onChange={handleChangePhoneValue}
                    value={phone}
                    title="Số điện thoại"
                    errorMessage={'Vui lòng nhập đúng định dạng số điện thoại'}
                    errorCondition={!onlyPhoneNumVN(phone) && phone.length !== 0}
                />
            ) : step === 2 ? (
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
            ) : (
                <>
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
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? 'Gửi mã xác thực SMS' : step === 2 ? 'Xác thực mã OTP' : 'Tạo tài khoản'}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default RegisterForm;
